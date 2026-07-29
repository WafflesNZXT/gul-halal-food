import type { NotificationDeliveryRepository } from "../repositories/notifications.js";
import type { NotificationChannel, NotificationRecipientType, NotificationType } from "../../src/shared/notifications.js";
import { adminEmailTemplate, adminSmsTemplate, customerEmailTemplate, customerSmsTemplate, type NotificationOrder } from "./notification-templates.js";
import {
  configuredRecipients,
  createNotificationProvider,
  normalizeEmailRecipient,
  normalizeSmsRecipient,
  recipientHash,
  type NotificationProvider,
} from "./notifications.js";

type DispatchOptions = {
  orderId: string;
  order: NotificationOrder;
  statusUrl: string;
  adminUrl: string;
  smsConsent: boolean;
  repository: NotificationDeliveryRepository;
  provider?: NotificationProvider;
  environment?: NodeJS.ProcessEnv;
};

async function deliver(options: DispatchOptions, target: {
  channel: NotificationChannel;
  notificationType: NotificationType;
  recipientType: NotificationRecipientType;
  recipient: string;
  content: { body: string } | { subject: string; html: string };
  skipNoConsent?: boolean;
}) {
  const claim = await options.repository.claim({
    orderId: options.orderId,
    channel: target.channel,
    notificationType: target.notificationType,
    recipientType: target.recipientType,
    recipientHash: recipientHash(target.recipient),
  });
  if (!claim) return;
  if (target.skipNoConsent) {
    await options.repository.complete(claim.id, { status: "skipped_no_consent" });
    return;
  }
  const provider = options.provider ?? createNotificationProvider(options.environment);
  try {
    const result = target.channel === "sms"
      ? await provider.sendSms(target.recipient, (target.content as { body: string }).body)
      : await provider.sendEmail(target.recipient, (target.content as { subject: string; html: string }).subject, (target.content as { subject: string; html: string }).html);
    await options.repository.complete(claim.id, {
      status: result.status,
      providerMessageId: result.providerMessageId,
      errorCode: result.errorCode,
    });
  } catch {
    await options.repository.complete(claim.id, { status: "failed", errorCode: "provider_unavailable" });
  }
}

export async function dispatchNewOrderNotifications(options: DispatchOptions) {
  const environment = options.environment ?? process.env;
  const customerEmail = customerEmailTemplate(options.order, options.statusUrl);
  const adminEmail = adminEmailTemplate(options.order, options.adminUrl);
  const customerPhone = normalizeSmsRecipient(options.order.customerPhone);
  const customerEmailAddress = normalizeEmailRecipient(options.order.customerEmail);
  const deliveries: Promise<void>[] = [];
  if (customerPhone) deliveries.push(deliver(options, {
      channel: "sms", notificationType: "customer_order_confirmation", recipientType: "customer",
      recipient: customerPhone, content: { body: customerSmsTemplate(options.order, options.statusUrl) },
      skipNoConsent: !options.smsConsent,
    }));
  if (customerEmailAddress) deliveries.push(deliver(options, {
      channel: "email", notificationType: "customer_order_confirmation", recipientType: "customer",
      recipient: customerEmailAddress, content: customerEmail,
    }));
  for (const phone of configuredRecipients(environment.ADMIN_NOTIFICATION_PHONES, "sms")) deliveries.push(deliver(options, {
    channel: "sms", notificationType: "admin_new_order", recipientType: "admin", recipient: phone,
    content: { body: adminSmsTemplate(options.order, options.adminUrl) },
  }));
  for (const email of configuredRecipients(environment.ADMIN_NOTIFICATION_EMAILS, "email")) deliveries.push(deliver(options, {
    channel: "email", notificationType: "admin_new_order", recipientType: "admin", recipient: email, content: adminEmail,
  }));
  await Promise.allSettled(deliveries);
}
