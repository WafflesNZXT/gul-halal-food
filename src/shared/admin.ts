import type { CustomerOrderItem, CustomerStatusHistoryEntry, OrderStatus } from "./orders.js";
import type { AdminNotificationSummary } from "./notifications.js";

export const ADMIN_STATUS_GROUPS = {
  new: ["received", "reviewing"],
  upcoming: ["confirmed", "preparing", "ready"],
  finished: ["completed", "cancelled"],
} as const satisfies Record<string, readonly OrderStatus[]>;

export type AdminStatusGroup = keyof typeof ADMIN_STATUS_GROUPS;

export type AdminOrderSummary = {
  reference: string;
  status: OrderStatus;
  customerName: string;
  customerPhone: string;
  eventDate: string;
  eventType: string;
  venue: string;
  dishCount: number;
  totalPeople: number;
  createdAt: string;
  updatedAt: string;
};

export type AdminOrder = AdminOrderSummary & {
  customerEmail: string;
  customerNotes?: string;
  dietaryNeeds?: string;
  items: CustomerOrderItem[];
  statusHistory: CustomerStatusHistoryEntry[];
  adminNotes?: string;
  quotedTotalCents?: number;
  notifications: AdminNotificationSummary;
};

export type AdminOrderListResponse = {
  orders: AdminOrderSummary[];
  page: number;
  hasMore: boolean;
};
