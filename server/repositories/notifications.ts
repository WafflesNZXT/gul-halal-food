import { and, eq, inArray } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import type { NotificationDeliverySummary } from "../../src/shared/notifications.js";
import { getDatabase } from "../db.js";
import { notificationDeliveries } from "../schema.js";
import type { DeliveryClaim, DeliveryCompletion } from "../services/notifications.js";

export interface NotificationDeliveryRepository {
  claim(input: Omit<DeliveryClaim, "id">): Promise<DeliveryClaim | null>;
  complete(id: string, result: DeliveryCompletion): Promise<void>;
  listForOrder(orderId: string): Promise<NotificationDeliverySummary[]>;
}

export class PostgresNotificationDeliveryRepository implements NotificationDeliveryRepository {
  async claim(input: Omit<DeliveryClaim, "id">) {
    const now = new Date();
    const inserted = await getDatabase().insert(notificationDeliveries).values({
      id: randomUUID(), ...input, status: "pending", attemptCount: 1, createdAt: now, updatedAt: now,
    }).onConflictDoNothing().returning();
    if (inserted[0]) return { id: inserted[0].id, ...input };

    const existing = await getDatabase().select().from(notificationDeliveries).where(and(
      eq(notificationDeliveries.orderId, input.orderId),
      eq(notificationDeliveries.channel, input.channel),
      eq(notificationDeliveries.notificationType, input.notificationType),
      eq(notificationDeliveries.recipientHash, input.recipientHash),
    )).limit(1);
    if (!existing[0] || existing[0].status === "sent" || existing[0].status === "pending" || existing[0].status === "skipped_no_consent") return null;
    const retried = await getDatabase().update(notificationDeliveries).set({
      status: "pending", attemptCount: existing[0].attemptCount + 1, updatedAt: now, lastErrorCode: null,
    }).where(and(eq(notificationDeliveries.id, existing[0].id), inArray(notificationDeliveries.status, ["failed", "not_configured"]))).returning();
    return retried[0] ? { id: retried[0].id, ...input } : null;
  }

  async complete(id: string, result: DeliveryCompletion) {
    const now = new Date();
    await getDatabase().update(notificationDeliveries).set({
      status: result.status,
      providerMessageId: result.providerMessageId ?? null,
      lastErrorCode: result.errorCode ?? null,
      updatedAt: now,
      sentAt: result.status === "sent" ? now : null,
    }).where(eq(notificationDeliveries.id, id));
  }

  async listForOrder(orderId: string) {
    const rows = await getDatabase().select().from(notificationDeliveries).where(eq(notificationDeliveries.orderId, orderId));
    return rows.map((row) => ({ channel: row.channel, notificationType: row.notificationType, recipientType: row.recipientType, status: row.status, attemptCount: row.attemptCount }));
  }
}
