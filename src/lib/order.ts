export type OrderStatus = "pending" | "received" | "reviewing" | "confirmed" | "preparing" | "ready" | "completed" | "cancelled";

export type OrderItem = { dishSlug: string; dishName: string };

export type OrderDraft = {
  fullName: string;
  email: string;
  phone: string;
  eventDate: string;
  eventType: string;
  guestCount?: number;
  venue?: string;
  menuNotes?: string;
  dietaryNeeds?: string;
  items: OrderItem[];
};

export type Order = OrderDraft & { reference: string; status: OrderStatus; createdAt: string };
export type OrderSubmissionResult = { status: "not_configured" } | { status: "success"; order: Order; receiptUrl?: string; emailStatusUrl?: string; statusUrl?: string } | { status: "error"; message: string };

export async function submitOrder(_orderDraft: OrderDraft): Promise<OrderSubmissionResult> {
  // TODO: Replace this disconnected adapter with the authenticated order backend/email integration.
  return { status: "not_configured" };
}
