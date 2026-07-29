import assert from "node:assert/strict";
import test from "node:test";
import type { CustomerOrder, CreateOrderRequest } from "../../src/shared/orders.js";
import type { NotificationDeliverySummary } from "../../src/shared/notifications.js";
import { pricingSummaryLines, summarizePricing } from "../../src/shared/pricing.js";
import type { NotificationDeliveryRepository } from "../repositories/notifications.js";
import type { OrderRepository, StoredOrderInput } from "../repositories/orders.js";
import { dispatchNewOrderNotifications } from "../services/notification-dispatch.js";
import {
  adminEmailTemplate,
  adminSmsTemplate,
  customerEmailTemplate,
  customerSmsTemplate,
  type NotificationOrder,
} from "../services/notification-templates.js";
import {
  configuredRecipients,
  createNotificationProvider,
  type DeliveryClaim,
  type DeliveryCompletion,
  type NotificationProvider,
} from "../services/notifications.js";
import { createOrder } from "../services/orders.js";
import { parseCreateOrder } from "../validation/orders.js";

type DeliveryRecord = NotificationDeliverySummary & DeliveryClaim & {
  providerMessageId?: string;
  errorCode?: string;
};

class MemoryDeliveries implements NotificationDeliveryRepository {
  records = new Map<string, DeliveryRecord>();

  private key(input: Omit<DeliveryClaim, "id">) {
    return `${input.orderId}:${input.channel}:${input.notificationType}:${input.recipientHash}`;
  }

  async claim(input: Omit<DeliveryClaim, "id">) {
    const key = this.key(input);
    const existing = this.records.get(key);
    if (!existing) {
      const record: DeliveryRecord = { id: `delivery-${this.records.size + 1}`, ...input, status: "pending", attemptCount: 1 };
      this.records.set(key, record);
      return { id: record.id, ...input };
    }
    if (existing.status === "sent" || existing.status === "pending" || existing.status === "skipped_no_consent") return null;
    existing.status = "pending";
    existing.attemptCount += 1;
    existing.errorCode = undefined;
    return { id: existing.id, ...input };
  }

  async complete(id: string, result: DeliveryCompletion) {
    const record = [...this.records.values()].find((candidate) => candidate.id === id);
    assert.ok(record);
    record.status = result.status;
    record.providerMessageId = result.providerMessageId;
    record.errorCode = result.errorCode;
  }

  async listForOrder(orderId: string) {
    return [...this.records.values()]
      .filter((record) => record.orderId === orderId)
      .map(({ channel, notificationType, recipientType, status, attemptCount }) => ({
        channel, notificationType, recipientType, status, attemptCount,
      }));
  }
}

class RecordingProvider implements NotificationProvider {
  sms: Array<{ to: string; body: string }> = [];
  email: Array<{ to: string; subject: string; html: string }> = [];
  smsResult: Awaited<ReturnType<NotificationProvider["sendSms"]>> = { status: "sent", providerMessageId: "sms-1" };
  emailResult: Awaited<ReturnType<NotificationProvider["sendEmail"]>> = { status: "sent", providerMessageId: "email-1" };
  throws = false;

  async sendSms(to: string, body: string) {
    this.sms.push({ to, body });
    if (this.throws) throw new Error("provider failed");
    return this.smsResult;
  }

  async sendEmail(to: string, subject: string, html: string) {
    this.email.push({ to, subject, html });
    if (this.throws) throw new Error("provider failed");
    return this.emailResult;
  }
}

const notificationOrder: NotificationOrder = {
  reference: "GHF-2026-ABC123",
  eventDate: "2026-08-06",
  eventType: "family",
  venue: "Hayward",
  customerName: "Amina Khan",
  customerEmail: "amina@example.com",
  customerPhone: "+15107318687",
  dietaryNeeds: "No nuts",
  items: [
    { menuItemId: "biryani", slug: "biryani", name: "Biryani", peopleCount: 50, proteinLabel: "Chicken", spiceLevel: 2, extras: {}, pricingLabel: "$12 per person", unitPriceCents: 1200, lineTotalCents: 60000 },
    { menuItemId: "keer", slug: "keer", name: "Keer", peopleCount: 50, spiceLevel: 0, extras: {}, pricingLabel: "$4 per person", unitPriceCents: 400, lineTotalCents: 20000 },
  ],
};

const dispatch = (overrides: Partial<Parameters<typeof dispatchNewOrderNotifications>[0]> = {}) => {
  const repository = overrides.repository ?? new MemoryDeliveries();
  const provider = overrides.provider ?? new RecordingProvider();
  return {
    repository,
    provider,
    run: () => dispatchNewOrderNotifications({
      orderId: "order-1",
      order: notificationOrder,
      statusUrl: `https://orders.example/order-status/${"A".repeat(43)}`,
      adminUrl: "https://orders.example/admin/orders/GHF-2026-ABC123",
      smsConsent: true,
      environment: {},
      ...overrides,
      repository,
      provider,
    }),
  };
};

test("notification templates use snapshot pricing and keep customer and admin links separate", () => {
  const statusUrl = `https://orders.example/order-status/${"A".repeat(43)}`;
  const adminUrl = "https://orders.example/admin/orders/GHF-2026-ABC123";
  const customerSms = customerSmsTemplate(notificationOrder, statusUrl);
  const customerEmail = customerEmailTemplate(notificationOrder, statusUrl);
  const adminSms = adminSmsTemplate(notificationOrder, adminUrl);
  const adminEmail = adminEmailTemplate(notificationOrder, adminUrl);

  for (const content of [customerSms, customerEmail.html]) {
    assert.match(content, /Calculated Total: \$800\.00/);
    assert.match(content, new RegExp(statusUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.doesNotMatch(content, /admin\/orders|No nuts|provider|token hash/i);
  }
  for (const content of [adminSms, adminEmail.html]) {
    assert.match(content, /Calculated Total: \$800\.00/);
    assert.match(content, /admin\/orders\/GHF-2026-ABC123/);
    assert.doesNotMatch(content, /order-status\/|A{43}/);
  }
  assert.match(adminEmail.html, /No nuts/);
  assert.match(adminEmail.html, /amina@example\.com/);
  assert.match(customerEmail.html, /\$12\.00 per person/);
  assert.match(customerEmail.html, /\$600\.00/);
});

test("partial, unpriced, and quoted notification summaries remain truthful", () => {
  assert.deepEqual(pricingSummaryLines(summarizePricing([
    notificationOrder.items[0],
    { ...notificationOrder.items[1], unitPriceCents: undefined, lineTotalCents: undefined },
  ])), ["Known Subtotal: $600.00", "Final Total: Pending"]);
  assert.deepEqual(pricingSummaryLines(summarizePricing([
    { ...notificationOrder.items[0], unitPriceCents: undefined, lineTotalCents: undefined },
  ])), ["Final Total: Pending"]);
  assert.deepEqual(pricingSummaryLines(summarizePricing(notificationOrder.items, 85000)), ["Final Quoted Total: $850.00"]);
});

test("customer SMS requires consent while customer email remains independent", async () => {
  const repository = new MemoryDeliveries();
  const provider = new RecordingProvider();
  await dispatchNewOrderNotifications({
    orderId: "order-consent",
    order: notificationOrder,
    statusUrl: `https://orders.example/order-status/${"B".repeat(43)}`,
    adminUrl: "https://orders.example/admin/orders/GHF-2026-ABC123",
    smsConsent: false,
    repository,
    provider,
    environment: {},
  });
  assert.equal(provider.sms.length, 0);
  assert.equal(provider.email.length, 1);
  const records = [...repository.records.values()];
  assert.equal(records.find((row) => row.channel === "sms")?.status, "skipped_no_consent");
  assert.equal(records.find((row) => row.channel === "email")?.status, "sent");
});

test("duplicate dispatch sends once and separate admin recipients get separate records", async () => {
  const repository = new MemoryDeliveries();
  const provider = new RecordingProvider();
  const environment = {
    ADMIN_NOTIFICATION_PHONES: "+15105550001, +1 (510) 555-0002, +15105550001",
    ADMIN_NOTIFICATION_EMAILS: "owner@example.com, OWNER@example.com, family@example.com",
  };
  const operation = dispatch({ repository, provider, environment });
  await operation.run();
  await operation.run();
  assert.equal(provider.sms.length, 3);
  assert.equal(provider.email.length, 3);
  assert.equal(repository.records.size, 6);
  assert.equal([...repository.records.values()].every((row) => row.attemptCount === 1 && row.status === "sent"), true);
});

test("failed deliveries can retry, increment attempts, and sent deliveries are not resent", async () => {
  const repository = new MemoryDeliveries();
  const failed = new RecordingProvider();
  failed.smsResult = { status: "failed", errorCode: "twilio_503" };
  failed.emailResult = { status: "failed", errorCode: "resend_503" };
  await dispatch({ repository, provider: failed }).run();
  assert.equal([...repository.records.values()].every((row) => row.status === "failed"), true);

  const recovered = new RecordingProvider();
  await dispatch({ repository, provider: recovered }).run();
  await dispatch({ repository, provider: recovered }).run();
  assert.equal(recovered.sms.length, 1);
  assert.equal(recovered.email.length, 1);
  assert.equal([...repository.records.values()].every((row) => row.status === "sent" && row.attemptCount === 2), true);
});

test("disabled and missing-provider modes never contact a network provider", async () => {
  let fetchCount = 0;
  const fetcher: typeof fetch = async () => {
    fetchCount += 1;
    throw new Error("must not be called");
  };
  const disabled = createNotificationProvider({
    NOTIFICATION_DELIVERY_MODE: "disabled",
    TWILIO_ACCOUNT_SID: "configured",
    TWILIO_AUTH_TOKEN: "configured",
    TWILIO_MESSAGING_SERVICE_SID: "configured",
    RESEND_API_KEY: "configured",
    EMAIL_FROM: "orders@example.com",
  }, fetcher);
  assert.equal((await disabled.sendSms("+15105550000", "message")).status, "not_configured");
  assert.equal((await disabled.sendEmail("a@example.com", "subject", "<p>message</p>")).status, "not_configured");

  const missing = createNotificationProvider({ NOTIFICATION_DELIVERY_MODE: "live" }, fetcher);
  assert.equal((await missing.sendSms("+15105550000", "message")).status, "not_configured");
  assert.equal((await missing.sendEmail("a@example.com", "subject", "<p>message</p>")).status, "not_configured");
  assert.equal(fetchCount, 0);
});

test("disabled delivery mode persists a truthful not-configured state", async () => {
  const repository = new MemoryDeliveries();
  await dispatchNewOrderNotifications({
    orderId: "order-disabled",
    order: notificationOrder,
    statusUrl: `https://orders.example/order-status/${"C".repeat(43)}`,
    adminUrl: "https://orders.example/admin/orders/GHF-2026-ABC123",
    smsConsent: true,
    repository,
    environment: { NOTIFICATION_DELIVERY_MODE: "disabled" },
  });
  assert.equal(repository.records.size, 2);
  assert.equal([...repository.records.values()].every((row) => row.status === "not_configured"), true);
});

test("provider success, failure, and timeout return only safe delivery results", async () => {
  const successfulFetch: typeof fetch = async (input) => new Response(
    String(input).includes("twilio") ? JSON.stringify({ sid: "SM123" }) : JSON.stringify({ id: "email-123" }),
    { status: 200, headers: { "content-type": "application/json" } },
  );
  const environment = {
    NOTIFICATION_DELIVERY_MODE: "live",
    TWILIO_ACCOUNT_SID: "account",
    TWILIO_AUTH_TOKEN: "secret",
    TWILIO_MESSAGING_SERVICE_SID: "service",
    RESEND_API_KEY: "secret",
    EMAIL_FROM: "orders@example.com",
  };
  const successful = createNotificationProvider(environment, successfulFetch);
  assert.deepEqual(await successful.sendSms("+15105550000", "message"), { status: "sent", providerMessageId: "SM123" });
  assert.deepEqual(await successful.sendEmail("a@example.com", "subject", "<p>message</p>"), { status: "sent", providerMessageId: "email-123" });

  const failed = createNotificationProvider(environment, async () => new Response("failure", { status: 503 }));
  assert.deepEqual(await failed.sendSms("+15105550000", "message"), { status: "failed", errorCode: "twilio_503" });
  assert.deepEqual(await failed.sendEmail("a@example.com", "subject", "<p>message</p>"), { status: "failed", errorCode: "resend_503" });

  const timeout = createNotificationProvider(environment, async () => { throw new DOMException("timeout", "TimeoutError"); });
  assert.deepEqual(await timeout.sendSms("+15105550000", "message"), { status: "failed", errorCode: "twilio_timeout" });
  assert.deepEqual(await timeout.sendEmail("a@example.com", "subject", "<p>message</p>"), { status: "failed", errorCode: "resend_timeout" });
});

class MemoryOrders implements OrderRepository {
  stored?: StoredOrderInput;
  async referenceExists() { return false; }
  async create(input: StoredOrderInput): Promise<CustomerOrder> {
    this.stored = input;
    return {
      reference: input.reference,
      status: input.status,
      eventDate: input.eventDate,
      eventType: input.eventType,
      venue: input.venue,
      createdAt: input.createdAt.toISOString(),
      updatedAt: input.createdAt.toISOString(),
      items: input.items,
      statusHistory: [{ previousStatus: null, newStatus: "received", changedAt: input.createdAt.toISOString() }],
    };
  }
  async findPublicByTokenHash() { return null; }
  async findByReferenceForLookup() { return null; }
  async findCustomerSafeById() { return null; }
}

const request: CreateOrderRequest = {
  customerName: "Amina Khan",
  customerEmail: "amina@example.com",
  customerPhone: "+15107318687",
  eventDate: "2026-08-06",
  eventType: "family",
  venue: "Hayward",
  items: [{ menuItemId: "biryani", proteinChoice: "chicken", spiceLevel: 2, peopleCount: 25 }],
  website: "",
};

test("consent is stored with a timestamp and provider failure never invalidates order creation", async () => {
  const repository = new MemoryOrders();
  const deliveries = new MemoryDeliveries();
  const provider = new RecordingProvider();
  provider.throws = true;
  const created = await createOrder(repository, parseCreateOrder({ ...request, smsConsent: true }), {
    publicBaseUrl: "https://orders.example",
    notificationRepository: deliveries,
    notificationProvider: provider,
  });
  assert.equal(created.status, "received");
  assert.equal(repository.stored?.smsConsent, true);
  assert.ok(repository.stored?.smsConsentAt instanceof Date);
  assert.equal([...deliveries.records.values()].every((row) => row.status === "failed"), true);

  const withoutConsent = new MemoryOrders();
  await createOrder(withoutConsent, parseCreateOrder({ ...request, smsConsent: false }));
  assert.equal(withoutConsent.stored?.smsConsent, false);
  assert.equal(withoutConsent.stored?.smsConsentAt, undefined);
});

test("recipient configuration normalizes, trims, deduplicates, and ignores invalid values", () => {
  assert.deepEqual(configuredRecipients(" +1 (510) 555-0001, +15105550001, invalid ", "sms"), ["+15105550001"]);
  assert.deepEqual(configuredRecipients("OWNER@example.com, owner@example.com, , bad", "email"), ["owner@example.com"]);
});
