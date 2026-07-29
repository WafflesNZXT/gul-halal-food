import { boolean, index, integer, jsonb, pgEnum, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import type { OrderStatus } from "../src/shared/orders.js";

export const orderStatusEnum = pgEnum("order_status", ["pending", "received", "reviewing", "confirmed", "preparing", "ready", "completed", "cancelled"]);
export const actorTypeEnum = pgEnum("order_actor_type", ["system", "admin"]);
export const notificationChannelEnum = pgEnum("notification_channel", ["sms", "email"]);
export const notificationTypeEnum = pgEnum("notification_type", ["customer_order_confirmation", "admin_new_order"]);
export const notificationRecipientTypeEnum = pgEnum("notification_recipient_type", ["customer", "admin"]);
export const notificationStatusEnum = pgEnum("notification_status", ["pending", "sent", "failed", "not_configured", "skipped_no_consent"]);

export const orders = pgTable("orders", {
  id: text("id").primaryKey(),
  reference: text("reference").notNull(),
  status: orderStatusEnum("status").$type<OrderStatus>().notNull(),
  statusTokenHash: text("status_token_hash").notNull(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  eventDate: text("event_date").notNull(),
  eventType: text("event_type").notNull(),
  venue: text("venue").notNull(),
  customerNotes: text("customer_notes"),
  dietaryNeeds: text("dietary_needs"),
  adminNotes: text("admin_notes"),
  quotedTotalCents: integer("quoted_total_cents"),
  smsConsent: boolean("sms_consent").notNull().default(false),
  smsConsentAt: timestamp("sms_consent_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex("orders_reference_unique").on(table.reference),
  uniqueIndex("orders_status_token_hash_unique").on(table.statusTokenHash),
  index("orders_status_event_date_index").on(table.status, table.eventDate),
]);

export const adminSessions = pgTable("admin_sessions", {
  id: text("id").primaryKey(),
  tokenHash: text("token_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex("admin_sessions_token_hash_unique").on(table.tokenHash),
  index("admin_sessions_expires_at_index").on(table.expiresAt),
]);

export const orderItems = pgTable("order_items", {
  id: text("id").primaryKey(),
  orderId: text("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  menuItemId: text("menu_item_id").notNull(),
  slug: text("slug").notNull(),
  displayName: text("display_name").notNull(),
  peopleCount: integer("people_count").notNull(),
  proteinLabel: text("protein_label"),
  spiceLevel: integer("spice_level").notNull(),
  extras: jsonb("extras").$type<Record<string, string>>().notNull().default({}),
  pricingLabel: text("pricing_label").notNull(),
  unitPriceCents: integer("unit_price_cents"),
  lineTotalCents: integer("line_total_cents"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [index("order_items_order_id_index").on(table.orderId)]);

export const orderStatusHistory = pgTable("order_status_history", {
  id: text("id").primaryKey(),
  orderId: text("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  previousStatus: orderStatusEnum("previous_status").$type<OrderStatus | null>(),
  newStatus: orderStatusEnum("new_status").$type<OrderStatus>().notNull(),
  actorType: actorTypeEnum("actor_type").notNull(),
  changedAt: timestamp("changed_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [index("order_status_history_order_id_index").on(table.orderId)]);

export const notificationDeliveries = pgTable("notification_deliveries", {
  id: text("id").primaryKey(),
  orderId: text("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  channel: notificationChannelEnum("channel").notNull(),
  notificationType: notificationTypeEnum("notification_type").notNull(),
  recipientType: notificationRecipientTypeEnum("recipient_type").notNull(),
  recipientHash: text("recipient_hash").notNull(),
  status: notificationStatusEnum("status").notNull().default("pending"),
  providerMessageId: text("provider_message_id"),
  attemptCount: integer("attempt_count").notNull().default(0),
  lastErrorCode: text("last_error_code"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  sentAt: timestamp("sent_at", { withTimezone: true }),
}, (table) => [
  uniqueIndex("notification_deliveries_idempotency_unique").on(table.orderId, table.channel, table.notificationType, table.recipientHash),
  index("notification_deliveries_order_id_index").on(table.orderId),
]);
