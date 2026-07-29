import assert from "node:assert/strict";
import test from "node:test";
import type { AddressInfo } from "node:net";
import { createApp } from "../app.js";
import { AppError } from "../errors.js";
import type { OrderRepository, StoredOrderInput } from "../repositories/orders.js";
import { createOrder, getPublicOrderStatus, hashStatusToken, lookupOrder } from "../services/orders.js";
import { parseOrderLookup } from "../validation/lookup.js";
import { parseCreateOrder } from "../validation/orders.js";
import { getMigrationDatabaseUrl, getPublicBaseUrl, getRuntimeDatabaseUrl } from "../env.js";
import { configureProxyTrust } from "../middleware/security.js";
import type { CreateOrderRequest, CustomerOrder } from "../../src/shared/orders.js";
import { menu } from "../../src/data/menu.js";

const validPayload: CreateOrderRequest = {
  customerName: "Amina Khan",
  customerEmail: "amina@example.com",
  customerPhone: "+1 555 555 5555",
  eventDate: "2026-08-20",
  eventType: "family",
  venue: "Community center",
  items: [{ menuItemId: "biryani", proteinChoice: "chicken", spiceLevel: 2, peopleCount: 25 }],
  website: "",
};

class MemoryOrders implements OrderRepository {
  readonly records = new Map<string, { input: StoredOrderInput; publicOrder: CustomerOrder }>();
  failCreates = false;

  async referenceExists(reference: string) {
    return [...this.records.values()].some((record) => record.input.reference === reference);
  }

  async create(input: StoredOrderInput) {
    if (this.failCreates) throw new Error("database connection failed");
    const publicOrder: CustomerOrder = {
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
    this.records.set(input.statusTokenHash, { input, publicOrder });
    return publicOrder;
  }

  async findPublicByTokenHash(tokenHash: string) {
    return this.records.get(tokenHash)?.publicOrder ?? null;
  }

  async findByReferenceForLookup(reference: string) {
    for (const record of this.records.values()) {
      if (record.publicOrder.reference === reference) {
        return { id: record.input.id, customerEmail: record.input.customerEmail, customerPhone: record.input.customerPhone };
      }
    }
    return null;
  }

  async findCustomerSafeById(id: string) {
    for (const record of this.records.values()) if (record.input.id === id) return record.publicOrder;
    return null;
  }
}

test("valid order payload is accepted with a human reference and secure status link", async () => {
  const repository = new MemoryOrders();
  const result = await createOrder(repository, parseCreateOrder(validPayload));
  assert.match(result.reference, /^GHF-\d{4}-[A-F0-9]{6}$/);
  assert.match(result.statusUrl, /^\/order-status\/[A-Za-z0-9_-]{43}$/);
  assert.equal(result.status, "received");
  assert.equal(repository.records.size, 1);
});

test("Biryani alone succeeds", async () => {
  const result = await createOrder(new MemoryOrders(), parseCreateOrder(validPayload));
  assert.equal(result.items[0].name, "Biryani");
  assert.equal(result.items[0].spiceLevel, 2);
});

test("priced items save immutable unit-price and line-total snapshots", async () => {
  const biryani = menu.find((item) => item.id === "biryani")!;
  const previousPrice = biryani.unitPriceCents;
  try {
    biryani.unitPriceCents = 1200;
    const result = await createOrder(new MemoryOrders(), parseCreateOrder({
      ...validPayload,
      items: [{ ...validPayload.items[0], peopleCount: 50 }],
    }));
    assert.equal(result.items[0].unitPriceCents, 1200);
    assert.equal(result.items[0].lineTotalCents, 60000);
    biryani.unitPriceCents = 1300;
    assert.equal(result.items[0].unitPriceCents, 1200);
    assert.equal(result.items[0].lineTotalCents, 60000);
  } finally {
    biryani.unitPriceCents = previousPrice;
  }
});

test("Keer alone succeeds and preserves its non-spicy setting", async () => {
  const result = await createOrder(new MemoryOrders(), parseCreateOrder({
    ...validPayload,
    items: [{ menuItemId: "keer", spiceLevel: 0, peopleCount: 25 }],
  }));
  assert.equal(result.items[0].name, "Keer");
  assert.equal(result.items[0].spiceLevel, 0);
});

test("Biryani and Keer together succeed", async () => {
  const result = await createOrder(new MemoryOrders(), parseCreateOrder({
    ...validPayload,
    items: [
      validPayload.items[0],
      { menuItemId: "keer", spiceLevel: 0, peopleCount: 25 },
    ],
  }));
  assert.deepEqual(result.items.map((item) => item.name), ["Biryani", "Keer"]);
});

test("other non-spicy dishes succeed with their required configuration", async () => {
  const result = await createOrder(new MemoryOrders(), parseCreateOrder({
    ...validPayload,
    items: [
      { menuItemId: "gulab-jamun", spiceLevel: 0, peopleCount: 25 },
      { menuItemId: "plain-white-rice", spiceLevel: 0, peopleCount: 25, extras: { riceType: "plain" } },
      { menuItemId: "naan", proteinChoice: "regular", spiceLevel: 0, peopleCount: 25 },
    ],
  }));
  assert.deepEqual(result.items.map((item) => item.name), ["Gulab Jamun", "Plain White Rice", "Naan"]);
  assert.ok(result.items.every((item) => item.spiceLevel === 0));
});

test("invalid spice values are rejected according to the dish configuration", async () => {
  const repository = new MemoryOrders();
  await assert.rejects(
    () => createOrder(repository, parseCreateOrder({ ...validPayload, items: [{ menuItemId: "keer", spiceLevel: 2, peopleCount: 25 }] })),
    (error: unknown) => error instanceof AppError && error.statusCode === 400,
  );
  await assert.rejects(
    () => createOrder(repository, parseCreateOrder({ ...validPayload, items: [{ ...validPayload.items[0], spiceLevel: 0 }] })),
    (error: unknown) => error instanceof AppError && error.statusCode === 400,
  );
});

test("empty carts and invalid people counts are rejected", () => {
  assert.throws(() => parseCreateOrder({ ...validPayload, items: [] }), (error: unknown) => error instanceof AppError && error.statusCode === 400);
  assert.throws(() => parseCreateOrder({ ...validPayload, items: [{ ...validPayload.items[0], peopleCount: 0 }] }), (error: unknown) => error instanceof AppError && error.statusCode === 400);
});

test("unknown dishes and invalid dish configurations are rejected", async () => {
  const repository = new MemoryOrders();
  await assert.rejects(() => createOrder(repository, parseCreateOrder({ ...validPayload, items: [{ ...validPayload.items[0], menuItemId: "not-a-dish" }] })), (error: unknown) => error instanceof AppError && error.statusCode === 400);
  await assert.rejects(() => createOrder(repository, parseCreateOrder({ ...validPayload, items: [{ ...validPayload.items[0], proteinChoice: "pork" }] })), (error: unknown) => error instanceof AppError && error.statusCode === 400);
});

test("secure status lookup succeeds and excludes private customer fields", async () => {
  const repository = new MemoryOrders();
  const created = await createOrder(repository, parseCreateOrder(validPayload));
  const token = created.statusUrl.split("/").pop()!;
  const order = await getPublicOrderStatus(repository, token);
  assert.equal(order.reference, created.reference);
  assert.equal("customerEmail" in order, false);
  assert.equal("customerPhone" in order, false);
  assert.equal("statusTokenHash" in order, false);
});

test("order recovery accepts a matching email or normalized phone without rotating the status token", async () => {
  const repository = new MemoryOrders();
  const created = await createOrder(repository, parseCreateOrder(validPayload));
  const token = created.statusUrl.split("/").pop()!;
  const originalHash = hashStatusToken(token);
  const byEmail = await lookupOrder(repository, parseOrderLookup({ reference: created.reference.toLowerCase(), contact: " AMINA@EXAMPLE.COM " }));
  const byPhone = await lookupOrder(repository, parseOrderLookup({ reference: created.reference, contact: "+1 (555) 555-5555" }));
  assert.equal(byEmail.reference, created.reference);
  assert.equal(byPhone.reference, created.reference);
  assert.equal(repository.records.has(originalHash), true);
  assert.equal((await getPublicOrderStatus(repository, token)).reference, created.reference);
  assert.equal("customerEmail" in byEmail, false);
  assert.equal("customerPhone" in byEmail, false);
  assert.equal("adminNotes" in byEmail, false);
  assert.equal("notificationDeliveries" in byEmail, false);
});

test("order recovery accepts formatted and digits-only phone pairs for ready, completed, and cancelled orders", async () => {
  for (const status of ["ready", "completed", "cancelled"] as const) {
    const repository = new MemoryOrders();
    const created = await createOrder(repository, parseCreateOrder(validPayload));
    const record = [...repository.records.values()][0];
    record.input.customerPhone = "15555555555";
    record.publicOrder = { ...record.publicOrder, status };
    const result = await lookupOrder(repository, parseOrderLookup({ reference: created.reference, contact: "+1 (555) 555-5555" }));
    assert.equal(result.status, status);
  }
});

test("order recovery accepts a digits-only phone against a formatted stored number", async () => {
  const repository = new MemoryOrders();
  const created = await createOrder(repository, parseCreateOrder(validPayload));
  const result = await lookupOrder(repository, parseOrderLookup({ reference: created.reference, contact: "15555555555" }));
  assert.equal(result.reference, created.reference);
});

test("order recovery returns the same safe failure for wrong contacts and missing references", async () => {
  const repository = new MemoryOrders();
  const created = await createOrder(repository, parseCreateOrder(validPayload));
  for (const request of [
    { reference: created.reference, contact: "wrong@example.com" },
    { reference: created.reference, contact: "+1 555 000 0000" },
    { reference: "GHF-2026-ZZZ999", contact: "amina@example.com" },
  ]) {
    await assert.rejects(() => lookupOrder(repository, parseOrderLookup(request)), (error: unknown) => error instanceof AppError && error.statusCode === 404 && error.message === "We could not find an order matching those details.");
  }
  assert.throws(() => parseOrderLookup({ reference: "not-a-reference", contact: "amina@example.com" }), (error: unknown) => error instanceof AppError && error.statusCode === 400);
});

test("order lookup endpoint applies rate limiting and returns only customer-safe data", async () => {
  const repository = new MemoryOrders();
  const created = await createOrder(repository, parseCreateOrder(validPayload));
  const app = createApp(repository);
  const server = await new Promise<any>((resolve) => { const instance = app.listen(0, "127.0.0.1", () => resolve(instance)); });
  try {
    const port = (server.address() as AddressInfo).port;
    const response = await fetch(`http://127.0.0.1:${port}/api/orders/lookup`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ reference: created.reference, contact: validPayload.customerEmail }) });
    const body = await response.json() as Record<string, unknown>;
    assert.equal(response.status, 200);
    assert.ok(response.headers.get("ratelimit"));
    for (const privateField of ["customerName", "customerEmail", "customerPhone", "statusTokenHash", "adminNotes", "notificationDeliveries"]) assert.equal(privateField in body, false);
  } finally { await new Promise<void>((resolve) => server.close(() => resolve())); }
});

test("order lookup accepts a same-origin Vercel forwarded host", async () => {
  const repository = new MemoryOrders();
  const created = await createOrder(repository, parseCreateOrder(validPayload));
  const app = createApp(repository);
  const server = await new Promise<any>((resolve) => { const instance = app.listen(0, "127.0.0.1", () => resolve(instance)); });
  try {
    const port = (server.address() as AddressInfo).port;
    const response = await fetch(`http://127.0.0.1:${port}/api/orders/lookup`, { method: "POST", headers: { "content-type": "application/json", origin: "https://preview.example.vercel.app", "x-forwarded-host": "preview.example.vercel.app" }, body: JSON.stringify({ reference: created.reference, contact: validPayload.customerPhone }) });
    assert.equal(response.status, 200);
  } finally { await new Promise<void>((resolve) => server.close(() => resolve())); }
});

test("customer status preserves Keer as non-spicy", async () => {
  const repository = new MemoryOrders();
  const created = await createOrder(repository, parseCreateOrder({
    ...validPayload,
    items: [{ menuItemId: "keer", spiceLevel: 0, peopleCount: 25 }],
  }));
  const token = created.statusUrl.split("/").pop()!;
  const order = await getPublicOrderStatus(repository, token);
  assert.equal(order.items[0].name, "Keer");
  assert.equal(order.items[0].spiceLevel, 0);
});

test("invalid status tokens get the same safe not-found response", async () => {
  const repository = new MemoryOrders();
  await assert.rejects(() => getPublicOrderStatus(repository, "invalid"), (error: unknown) => error instanceof AppError && error.statusCode === 404 && error.message === "Order not found.");
  await assert.rejects(() => getPublicOrderStatus(repository, "a".repeat(43)), (error: unknown) => error instanceof AppError && error.statusCode === 404 && error.message === "Order not found.");
});

test("correctly formatted missing status tokens return Express's safe JSON 404", async () => {
  const app = createApp(new MemoryOrders());
  const server = await new Promise<any>((resolve) => {
    const instance = app.listen(0, "127.0.0.1", () => resolve(instance));
  });
  try {
    const port = (server.address() as AddressInfo).port;
    const response = await fetch(`http://127.0.0.1:${port}/api/orders/status/${"A".repeat(43)}`);
    assert.equal(response.status, 404);
    assert.deepEqual(await response.json(), { error: { code: "NOT_FOUND", message: "Order not found." } });
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});

test("database failures receive a safe API response", async () => {
  const repository = new MemoryOrders();
  repository.failCreates = true;
  const app = createApp(repository);
  const server = await new Promise<any>((resolve) => {
    const instance = app.listen(0, "127.0.0.1", () => resolve(instance));
  });
  try {
    const port = (server.address() as AddressInfo).port;
    const response = await fetch(`http://127.0.0.1:${port}/api/orders`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(validPayload) });
    const body = await response.json() as { error: { code: string; message: string } };
    assert.equal(response.status, 500);
    assert.equal(body.error.code, "SERVER_ERROR");
    assert.doesNotMatch(body.error.message, /database/i);
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});

test("health endpoint returns only a safe service status", async () => {
  const app = createApp(new MemoryOrders());
  const server = await new Promise<any>((resolve) => {
    const instance = app.listen(0, "127.0.0.1", () => resolve(instance));
  });
  try {
    const port = (server.address() as AddressInfo).port;
    const response = await fetch(`http://127.0.0.1:${port}/api/health`);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { status: "ok" });
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});

test("status tokens are stored only as hashes", async () => {
  const repository = new MemoryOrders();
  const created = await createOrder(repository, parseCreateOrder(validPayload));
  const token = created.statusUrl.split("/").pop()!;
  assert.equal(repository.records.has(token), false);
  assert.equal(repository.records.has(hashStatusToken(token)), true);
});

test("database URLs use the runtime and migration precedence expected by Neon and Vercel", () => {
  const environment = {
    DATABASE_URL: "runtime-database-url",
    POSTGRES_URL: "runtime-postgres-url",
    DATABASE_URL_UNPOOLED: "migration-unpooled-url",
    POSTGRES_URL_NON_POOLING: "migration-postgres-url",
  } as NodeJS.ProcessEnv;
  assert.equal(getRuntimeDatabaseUrl(environment), "runtime-database-url");
  assert.equal(getMigrationDatabaseUrl(environment), "migration-unpooled-url");
  assert.equal(getMigrationDatabaseUrl({ POSTGRES_URL: "runtime-postgres-url" }), "runtime-postgres-url");
});

const originRequest = (headers: Record<string, string>) => ({
  get(name: string) { return headers[name.toLowerCase()]; },
});

test("order creation rejects a malicious external browser origin", async () => {
  const app = createApp(new MemoryOrders());
  const server = await new Promise<any>((resolve) => {
    const instance = app.listen(0, "127.0.0.1", () => resolve(instance));
  });
  try {
    const port = (server.address() as AddressInfo).port;
    const response = await fetch(`http://127.0.0.1:${port}/api/orders`, {
      method: "POST",
      headers: { "content-type": "application/json", origin: "https://malicious.example" },
      body: JSON.stringify(validPayload),
    });
    assert.equal(response.status, 403);
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});

test("public status links prefer verified browser and forwarded public origins", async () => {
  const localBase = getPublicBaseUrl(originRequest({
    origin: "http://localhost:5173",
    host: "localhost:5000",
    "x-forwarded-proto": "http",
  }), { APP_BASE_URL: "http://localhost:5173" });
  assert.equal(localBase, "http://localhost:5173");
  const localOrder = await createOrder(new MemoryOrders(), parseCreateOrder(validPayload), { publicBaseUrl: localBase });
  assert.match(localOrder.statusUrl, /^http:\/\/localhost:5173\/order-status\/[A-Za-z0-9_-]{43}$/);

  for (const browserOrigin of [
    "https://gul-preview-abc.vercel.app",
    "https://gulhalalfood.com",
    "https://orders.gulhalalfood.com",
  ]) {
    const host = new URL(browserOrigin).host;
    const publicBase = getPublicBaseUrl(originRequest({
      origin: browserOrigin,
      "x-forwarded-host": host,
      "x-forwarded-proto": "https",
    }), { VERCEL: "1", APP_BASE_URL: "https://wrong-config.example" });
    assert.equal(publicBase, browserOrigin);
    const order = await createOrder(new MemoryOrders(), parseCreateOrder(validPayload), { publicBaseUrl: publicBase });
    assert.match(order.statusUrl, new RegExp(`^${browserOrigin.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/order-status/[A-Za-z0-9_-]{43}$`));
  }

  assert.equal(getPublicBaseUrl(originRequest({
    "x-forwarded-host": "gul-preview-abc.vercel.app",
    "x-forwarded-proto": "https",
  }), { APP_BASE_URL: "https://production.example" }), "https://gul-preview-abc.vercel.app");
  assert.equal(getPublicBaseUrl(originRequest({
    host: "internal-function.local",
  }), { APP_BASE_URL: "https://production.example" }), "https://production.example");

  assert.equal(getPublicBaseUrl(originRequest({
    origin: "https://malicious.example",
    "x-forwarded-host": "gulhalalfood.com",
    "x-forwarded-proto": "https",
  }), { APP_BASE_URL: "https://gulhalalfood.com" }), "https://gulhalalfood.com");

  assert.equal(getPublicBaseUrl(undefined, { VERCEL_URL: "gul-halal-food.vercel.app" }), "https://gul-halal-food.vercel.app");
  assert.equal(getPublicBaseUrl(undefined, { APP_BASE_URL: "https://catering.example.com/" }), "https://catering.example.com");

  const result = await createOrder(new MemoryOrders(), parseCreateOrder(validPayload), { publicBaseUrl: "https://catering.example.com" });
  assert.match(result.statusUrl, /^https:\/\/catering\.example\.com\/order-status\/[A-Za-z0-9_-]{43}$/);
});

test("Vercel trusts exactly one proxy hop for rate-limit client IPs", () => {
  const vercelSettings: number[] = [];
  configureProxyTrust({ set: (_name, value) => { vercelSettings.push(value); } }, { VERCEL: "1" });
  assert.deepEqual(vercelSettings, [1]);

  const localSettings: number[] = [];
  configureProxyTrust({ set: (_name, value) => { localSettings.push(value); } }, {});
  assert.deepEqual(localSettings, []);
});
