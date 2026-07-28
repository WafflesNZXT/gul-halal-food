import type { CreateOrderRequest, CreateOrderResponse, CustomerOrder } from "@/shared/orders";

export type { CustomerOrder as Order, OrderStatus } from "@/shared/orders";
export type OrderDraft = CreateOrderRequest;

export type OrderSubmissionResult =
  | { status: "success"; order: CreateOrderResponse }
  | { status: "error"; message: string; code?: string; details?: Array<{ path: string; message: string }> };

function isApiError(value: unknown): value is { error: { code?: string; message?: string; details?: Array<{ path: string; message: string }> } } {
  return Boolean(value && typeof value === "object" && "error" in value);
}

export async function submitOrder(orderDraft: OrderDraft): Promise<OrderSubmissionResult> {
  try {
    const response = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin", body: JSON.stringify(orderDraft) });
    const payload: unknown = await response.json().catch(() => null);
    if (!response.ok) {
      if (isApiError(payload)) return { status: "error", message: payload.error.message ?? "We could not submit your request.", code: payload.error.code, details: payload.error.details };
      return { status: "error", message: "We could not submit your request. Please try again later." };
    }
    return { status: "success", order: payload as CreateOrderResponse };
  } catch {
    return { status: "error", code: "NETWORK_ERROR", message: "We could not reach the order service. Your request has not been sent." };
  }
}

export function clearCartAfterSuccessfulSubmission(result: OrderSubmissionResult, clearCart: () => void) {
  if (result.status !== "success") return false;
  clearCart();
  return true;
}

export async function fetchOrderStatus(token: string): Promise<CustomerOrder> {
  const response = await fetch(`/api/orders/status/${encodeURIComponent(token)}`, { credentials: "same-origin" });
  const payload: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message = isApiError(payload) ? payload.error.message : "Order not found.";
    throw Object.assign(new Error(message), { code: isApiError(payload) ? payload.error.code : undefined, status: response.status });
  }
  return payload as CustomerOrder;
}
