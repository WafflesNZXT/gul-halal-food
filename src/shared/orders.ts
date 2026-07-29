export const ORDER_STATUSES = [
  "pending",
  "received",
  "reviewing",
  "confirmed",
  "preparing",
  "ready",
  "completed",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];
export type OrderActorType = "system" | "admin";
export type SpiceLevel = 0 | 1 | 2 | 3;

export type OrderItemInput = {
  menuItemId: string;
  proteinChoice?: string;
  spiceLevel: SpiceLevel;
  extras?: Record<string, string>;
  peopleCount: number;
};

export type CreateOrderRequest = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  eventDate: string;
  eventType: string;
  venue: string;
  customerNotes?: string;
  dietaryNeeds?: string;
  items: OrderItemInput[];
  website?: string;
};

export type CustomerOrderItem = {
  menuItemId: string;
  slug: string;
  name: string;
  peopleCount: number;
  proteinLabel?: string;
  spiceLevel: SpiceLevel;
  extras: Record<string, string>;
  pricingLabel: string;
};

export type CustomerStatusHistoryEntry = {
  previousStatus: OrderStatus | null;
  newStatus: OrderStatus;
  changedAt: string;
};

export type CustomerOrder = {
  reference: string;
  status: OrderStatus;
  eventDate: string;
  eventType: string;
  venue: string;
  createdAt: string;
  updatedAt: string;
  items: CustomerOrderItem[];
  statusHistory: CustomerStatusHistoryEntry[];
};

export type CreateOrderResponse = CustomerOrder & { statusUrl: string };
