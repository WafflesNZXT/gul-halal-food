import { createHash } from "node:crypto";
import type { NotificationChannel, NotificationDeliveryStatus, NotificationRecipientType, NotificationType } from "../../src/shared/notifications.js";

export type NotificationResult = { status: "sent" | "not_configured" | "failed"; providerMessageId?: string; errorCode?: string };
export type NotificationProvider = {
  sendSms(to: string, body: string): Promise<NotificationResult>;
  sendEmail(to: string, subject: string, html: string): Promise<NotificationResult>;
};
export type DeliveryMode = "disabled" | "live";

export function getDeliveryMode(environment: NodeJS.ProcessEnv = process.env): DeliveryMode {
  return environment.NOTIFICATION_DELIVERY_MODE?.trim().toLowerCase() === "live" ? "live" : "disabled";
}

export function recipientHash(value: string) {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

export function normalizeSmsRecipient(value: string) {
  const trimmed = value.trim();
  if (!/^\+?[0-9()\s.-]+$/.test(trimmed)) return null;
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 15) return null;
  return `${trimmed.startsWith("+") ? "+" : ""}${digits}`;
}

export function normalizeEmailRecipient(value: string) {
  const email = value.trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
}

export function configuredRecipients(value: string | undefined, channel: NotificationChannel) {
  const normalize = channel === "sms" ? normalizeSmsRecipient : normalizeEmailRecipient;
  return [...new Set((value ?? "").split(",").map((entry) => normalize(entry)).filter((entry): entry is string => Boolean(entry)))];
}

const configured = (value?: string) => Boolean(value?.trim());

export function createNotificationProvider(environment: NodeJS.ProcessEnv = process.env, fetcher: typeof fetch = fetch): NotificationProvider {
  const live = getDeliveryMode(environment) === "live";
  return {
    async sendSms(to, body) {
      if (!live || !configured(environment.TWILIO_ACCOUNT_SID) || !configured(environment.TWILIO_AUTH_TOKEN) || !configured(environment.TWILIO_MESSAGING_SERVICE_SID)) return { status: "not_configured" };
      try {
        const credentials = Buffer.from(`${environment.TWILIO_ACCOUNT_SID}:${environment.TWILIO_AUTH_TOKEN}`).toString("base64");
        const response = await fetcher(`https://api.twilio.com/2010-04-01/Accounts/${environment.TWILIO_ACCOUNT_SID}/Messages.json`, {
          method: "POST",
          headers: { authorization: `Basic ${credentials}`, "content-type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ To: to, MessagingServiceSid: environment.TWILIO_MESSAGING_SERVICE_SID!, Body: body }),
          signal: AbortSignal.timeout(8_000),
        });
        if (!response.ok) return { status: "failed", errorCode: `twilio_${response.status}` };
        const data = await response.json() as { sid?: string };
        return { status: "sent", providerMessageId: data.sid };
      } catch (error) {
        return { status: "failed", errorCode: error instanceof DOMException && error.name === "TimeoutError" ? "twilio_timeout" : "twilio_unavailable" };
      }
    },
    async sendEmail(to, subject, html) {
      if (!live || !configured(environment.RESEND_API_KEY) || !configured(environment.EMAIL_FROM)) return { status: "not_configured" };
      try {
        const response = await fetcher("https://api.resend.com/emails", {
          method: "POST",
          headers: { authorization: `Bearer ${environment.RESEND_API_KEY}`, "content-type": "application/json" },
          body: JSON.stringify({ from: environment.EMAIL_FROM, to: [to], subject, html }),
          signal: AbortSignal.timeout(8_000),
        });
        if (!response.ok) return { status: "failed", errorCode: `resend_${response.status}` };
        const data = await response.json() as { id?: string };
        return { status: "sent", providerMessageId: data.id };
      } catch (error) {
        return { status: "failed", errorCode: error instanceof DOMException && error.name === "TimeoutError" ? "resend_timeout" : "resend_unavailable" };
      }
    },
  };
}

export type DeliveryClaim = {
  id: string;
  orderId: string;
  channel: NotificationChannel;
  notificationType: NotificationType;
  recipientType: NotificationRecipientType;
  recipientHash: string;
};
export type DeliveryCompletion = {
  status: Exclude<NotificationDeliveryStatus, "pending">;
  providerMessageId?: string;
  errorCode?: string;
};
