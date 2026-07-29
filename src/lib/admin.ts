import type { AdminOrder, AdminOrderListResponse, AdminStatusGroup } from "@/shared/admin";
import type { OrderStatus } from "@/shared/orders";

type ApiError = Error & { status?: number };

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, { credentials: "same-origin", ...init, headers: { ...(init?.body ? { "Content-Type": "application/json" } : {}), ...init?.headers } });
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { error?: { message?: string } } | null;
    const error = Object.assign(new Error(body?.error?.message ?? "Could not complete that request. Try again."), { status: response.status }) as ApiError;
    throw error;
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const adminApi = {
  session: () => request<{ authenticated: true; expiresAt: string }>("/api/admin/session"),
  login: (username: string, password: string) => request<{ authenticated: true }>("/api/admin/login", { method: "POST", body: JSON.stringify({ username, password }) }),
  logout: () => request<void>("/api/admin/logout", { method: "POST", body: "{}" }),
  listOrders: (group: AdminStatusGroup, search: string, page = 1) => request<AdminOrderListResponse>(`/api/admin/orders?${new URLSearchParams({ group, ...(search ? { search } : {}), page: String(page) })}`),
  order: (reference: string) => request<AdminOrder>(`/api/admin/orders/${encodeURIComponent(reference)}`),
  updateStatus: (reference: string, status: OrderStatus) => request<AdminOrder>(`/api/admin/orders/${encodeURIComponent(reference)}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  updateNotes: (reference: string, adminNotes: string) => request<AdminOrder>(`/api/admin/orders/${encodeURIComponent(reference)}/notes`, { method: "PATCH", body: JSON.stringify({ adminNotes }) }),
  updatePrice: (reference: string, quotedTotalCents: number | null) => request<AdminOrder>(`/api/admin/orders/${encodeURIComponent(reference)}/price`, { method: "PATCH", body: JSON.stringify({ quotedTotalCents }) }),
};

export function formatAdminCurrency(cents: number | undefined) {
  return cents === undefined ? "Not entered" : new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

export function parseDollarsToCents(value: string) {
  const match = /^(?:0|[1-9]\d{0,6})(?:\.(\d{1,2}))?$/.exec(value.trim());
  if (!match) return undefined;
  const [whole] = value.trim().split(".");
  return Number(whole) * 100 + Number((match[1] ?? "").padEnd(2, "0") || 0);
}

export function formatAdminDishDetails(item: { proteinLabel?: string; spiceLevel: number; extras: Record<string, string> }) {
  return [item.proteinLabel, item.spiceLevel > 0 ? `Spice level ${item.spiceLevel}` : undefined, ...Object.values(item.extras)].filter(Boolean).join(" · ") || "Standard preparation";
}
