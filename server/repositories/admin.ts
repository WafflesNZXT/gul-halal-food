import { and, asc, desc, eq, gt, ilike, inArray, or } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import type { AdminOrder, AdminOrderListResponse, AdminOrderSummary, AdminStatusGroup } from "../../src/shared/admin.js";
import type { CustomerOrderItem, CustomerStatusHistoryEntry, OrderStatus, SpiceLevel } from "../../src/shared/orders.js";
import { getDatabase } from "../db.js";
import { adminSessions, notificationDeliveries, orderItems, orders, orderStatusHistory } from "../schema.js";
import type { AdminNotificationSummary, NotificationDeliverySummary } from "../../src/shared/notifications.js";
import { ADMIN_STATUS_GROUPS } from "../../src/shared/admin.js";

export type AdminSession = { id: string; tokenHash: string; expiresAt: Date; lastSeenAt: Date };
export type AdminOrderListOptions = { group?: AdminStatusGroup; search?: string; page?: number; limit?: number };

function asIso(value: Date | string) { return typeof value === "string" ? value : value.toISOString(); }
function toItem(item: typeof orderItems.$inferSelect): CustomerOrderItem {
  return { menuItemId: item.menuItemId, slug: item.slug, name: item.displayName, peopleCount: item.peopleCount, proteinLabel: item.proteinLabel ?? undefined, spiceLevel: item.spiceLevel as SpiceLevel, extras: item.extras, pricingLabel: item.pricingLabel, unitPriceCents: item.unitPriceCents ?? undefined, lineTotalCents: item.lineTotalCents ?? undefined };
}
function toHistory(entry: typeof orderStatusHistory.$inferSelect): CustomerStatusHistoryEntry {
  return { previousStatus: entry.previousStatus, newStatus: entry.newStatus, changedAt: asIso(entry.changedAt) };
}
function notificationSummary(rows: NotificationDeliverySummary[]): AdminNotificationSummary {
  const select = (recipientType: "customer" | "admin", channel: "sms" | "email") => rows.filter((row) => row.recipientType === recipientType && row.channel === channel);
  return { customerSms: select("customer", "sms"), customerEmail: select("customer", "email"), adminSms: select("admin", "sms"), adminEmail: select("admin", "email") };
}

export interface AdminRepository {
  createSession(tokenHash: string, expiresAt: Date): Promise<void>;
  findSession(tokenHash: string): Promise<AdminSession | null>;
  revokeSession(tokenHash: string): Promise<void>;
  touchSession(tokenHash: string, lastSeenAt: Date): Promise<void>;
  listOrders(options: AdminOrderListOptions): Promise<AdminOrderListResponse>;
  findOrder(reference: string): Promise<AdminOrder | null>;
  updateStatus(reference: string, status: OrderStatus): Promise<AdminOrder | null>;
  updateNotes(reference: string, adminNotes: string | undefined): Promise<AdminOrder | null>;
  updatePrice(reference: string, quotedTotalCents: number | undefined): Promise<AdminOrder | null>;
}

export class PostgresAdminRepository implements AdminRepository {
  async createSession(tokenHash: string, expiresAt: Date) {
    const now = new Date();
    await getDatabase().insert(adminSessions).values({ id: randomUUID(), tokenHash, expiresAt, createdAt: now, lastSeenAt: now });
  }
  async findSession(tokenHash: string) {
    const rows = await getDatabase().select().from(adminSessions).where(and(eq(adminSessions.tokenHash, tokenHash), gt(adminSessions.expiresAt, new Date()))).limit(1);
    const row = rows[0];
    return row ? { id: row.id, tokenHash: row.tokenHash, expiresAt: row.expiresAt, lastSeenAt: row.lastSeenAt } : null;
  }
  async revokeSession(tokenHash: string) { await getDatabase().delete(adminSessions).where(eq(adminSessions.tokenHash, tokenHash)); }
  async touchSession(tokenHash: string, lastSeenAt: Date) { await getDatabase().update(adminSessions).set({ lastSeenAt }).where(eq(adminSessions.tokenHash, tokenHash)); }

  async listOrders(options: AdminOrderListOptions): Promise<AdminOrderListResponse> {
    const page = Math.max(1, options.page ?? 1);
    const limit = Math.min(50, Math.max(1, options.limit ?? 25));
    const search = options.search?.trim();
    const conditions = [];
    if (options.group) conditions.push(inArray(orders.status, [...ADMIN_STATUS_GROUPS[options.group]]));
    if (search) {
      const pattern = `%${search.replace(/[\\%_]/g, "\\$&")}%`;
      conditions.push(or(ilike(orders.reference, pattern), ilike(orders.customerName, pattern), ilike(orders.customerPhone, pattern))!);
    }
    const sort = options.group === "finished" ? desc(orders.updatedAt) : options.group === "new" ? asc(orders.createdAt) : asc(orders.eventDate);
    const rows = await getDatabase().select().from(orders).where(conditions.length ? and(...conditions) : undefined).orderBy(sort).limit(limit + 1).offset((page - 1) * limit);
    const pageRows = rows.slice(0, limit);
    const ids = pageRows.map((row) => row.id);
    const items = ids.length ? await getDatabase().select().from(orderItems).where(inArray(orderItems.orderId, ids)) : [];
    const counts = new Map<string, { dishCount: number; totalPeople: number }>();
    for (const item of items) {
      const current = counts.get(item.orderId) ?? { dishCount: 0, totalPeople: 0 };
      current.dishCount += 1; current.totalPeople += item.peopleCount; counts.set(item.orderId, current);
    }
    return { orders: pageRows.map((row): AdminOrderSummary => ({ reference: row.reference, status: row.status, customerName: row.customerName, customerPhone: row.customerPhone, eventDate: row.eventDate, eventType: row.eventType, venue: row.venue, dishCount: counts.get(row.id)?.dishCount ?? 0, totalPeople: counts.get(row.id)?.totalPeople ?? 0, createdAt: asIso(row.createdAt), updatedAt: asIso(row.updatedAt) })), page, hasMore: rows.length > limit };
  }

  async findOrder(reference: string) {
    const rows = await getDatabase().select().from(orders).where(eq(orders.reference, reference)).limit(1);
    const row = rows[0];
    if (!row) return null;
    const [items, history, deliveries] = await Promise.all([
      getDatabase().select().from(orderItems).where(eq(orderItems.orderId, row.id)),
      getDatabase().select().from(orderStatusHistory).where(eq(orderStatusHistory.orderId, row.id)).orderBy(asc(orderStatusHistory.changedAt)),
      getDatabase().select().from(notificationDeliveries).where(eq(notificationDeliveries.orderId, row.id)),
    ]);
    const summary: AdminOrderSummary = { reference: row.reference, status: row.status, customerName: row.customerName, customerPhone: row.customerPhone, eventDate: row.eventDate, eventType: row.eventType, venue: row.venue, dishCount: items.length, totalPeople: items.reduce((sum, item) => sum + item.peopleCount, 0), createdAt: asIso(row.createdAt), updatedAt: asIso(row.updatedAt) };
    return { ...summary, customerEmail: row.customerEmail, customerNotes: row.customerNotes ?? undefined, dietaryNeeds: row.dietaryNeeds ?? undefined, items: items.map(toItem), statusHistory: history.map(toHistory), adminNotes: row.adminNotes ?? undefined, quotedTotalCents: row.quotedTotalCents ?? undefined, notifications: notificationSummary(deliveries.map((delivery) => ({ channel: delivery.channel, notificationType: delivery.notificationType, recipientType: delivery.recipientType, status: delivery.status, attemptCount: delivery.attemptCount }))) };
  }
  async updateStatus(reference: string, status: OrderStatus) {
    const current = await this.findOrder(reference);
    if (!current || current.status === status) return current;
    const now = new Date();
    await getDatabase().transaction(async (tx) => {
      await tx.update(orders).set({ status, updatedAt: now }).where(eq(orders.reference, reference));
      const row = await tx.select({ id: orders.id }).from(orders).where(eq(orders.reference, reference)).limit(1);
      if (row[0]) await tx.insert(orderStatusHistory).values({ id: randomUUID(), orderId: row[0].id, previousStatus: current.status, newStatus: status, actorType: "admin", changedAt: now });
    });
    return this.findOrder(reference);
  }
  async updateNotes(reference: string, adminNotes: string | undefined) {
    const result = await getDatabase().update(orders).set({ adminNotes: adminNotes || null, updatedAt: new Date() }).where(eq(orders.reference, reference)).returning({ reference: orders.reference });
    return result[0] ? this.findOrder(reference) : null;
  }
  async updatePrice(reference: string, quotedTotalCents: number | undefined) {
    const result = await getDatabase().update(orders).set({ quotedTotalCents: quotedTotalCents ?? null, updatedAt: new Date() }).where(eq(orders.reference, reference)).returning({ reference: orders.reference });
    return result[0] ? this.findOrder(reference) : null;
  }
}
