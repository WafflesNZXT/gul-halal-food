import { asc, eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import type { CustomerOrder, CustomerOrderItem, OrderStatus } from "../../src/shared/orders.js";
import { getDatabase } from "../db.js";
import { orderItems, orders, orderStatusHistory } from "../schema.js";

export type StoredOrderInput = {
  id: string;
  reference: string;
  status: OrderStatus;
  statusTokenHash: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  eventDate: string;
  eventType: string;
  venue: string;
  customerNotes?: string;
  dietaryNeeds?: string;
  items: CustomerOrderItem[];
  createdAt: Date;
};

export interface OrderRepository {
  referenceExists(reference: string): Promise<boolean>;
  create(input: StoredOrderInput): Promise<CustomerOrder>;
  findPublicByTokenHash(tokenHash: string): Promise<CustomerOrder | null>;
}

function asIso(value: Date | string): string {
  return typeof value === "string" ? value : value.toISOString();
}

export class PostgresOrderRepository implements OrderRepository {
  async referenceExists(reference: string) {
    const db = getDatabase();
    const existing = await db.select({ reference: orders.reference }).from(orders).where(eq(orders.reference, reference)).limit(1);
    return existing.length > 0;
  }

  async create(input: StoredOrderInput): Promise<CustomerOrder> {
    const db = getDatabase();
    await db.transaction(async (tx) => {
      await tx.insert(orders).values({
        id: input.id,
        reference: input.reference,
        status: input.status,
        statusTokenHash: input.statusTokenHash,
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        customerPhone: input.customerPhone,
        eventDate: input.eventDate,
        eventType: input.eventType,
        venue: input.venue,
        customerNotes: input.customerNotes,
        dietaryNeeds: input.dietaryNeeds,
        createdAt: input.createdAt,
        updatedAt: input.createdAt,
      });
      await tx.insert(orderItems).values(input.items.map((item) => ({
        id: randomUUID(),
        orderId: input.id,
        menuItemId: item.menuItemId,
        slug: item.slug,
        displayName: item.name,
        peopleCount: item.peopleCount,
        proteinLabel: item.proteinLabel,
        spiceLevel: item.spiceLevel,
        extras: item.extras,
        pricingLabel: item.pricingLabel,
        unitPrice: null,
        createdAt: input.createdAt,
      })));
      await tx.insert(orderStatusHistory).values({
        id: randomUUID(),
        orderId: input.id,
        previousStatus: null,
        newStatus: "received",
        actorType: "system",
        changedAt: input.createdAt,
      });
    });
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

  async findPublicByTokenHash(tokenHash: string): Promise<CustomerOrder | null> {
    const db = getDatabase();
    const found = await db.select().from(orders).where(eq(orders.statusTokenHash, tokenHash)).limit(1);
    const order = found[0];
    if (!order) return null;
    const [items, history] = await Promise.all([
      db.select().from(orderItems).where(eq(orderItems.orderId, order.id)),
      db.select().from(orderStatusHistory).where(eq(orderStatusHistory.orderId, order.id)).orderBy(asc(orderStatusHistory.changedAt)),
    ]);
    return {
      reference: order.reference,
      status: order.status,
      eventDate: order.eventDate,
      eventType: order.eventType,
      venue: order.venue,
      createdAt: asIso(order.createdAt),
      updatedAt: asIso(order.updatedAt),
      items: items.map((item) => ({
        menuItemId: item.menuItemId,
        slug: item.slug,
        name: item.displayName,
        peopleCount: item.peopleCount,
        proteinLabel: item.proteinLabel ?? undefined,
        spiceLevel: item.spiceLevel as 1 | 2 | 3,
        extras: item.extras,
        pricingLabel: item.pricingLabel,
      })),
      statusHistory: history.map((entry) => ({
        previousStatus: entry.previousStatus,
        newStatus: entry.newStatus,
        changedAt: asIso(entry.changedAt),
      })),
    };
  }
}
