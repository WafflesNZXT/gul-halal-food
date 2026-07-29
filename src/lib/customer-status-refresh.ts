export type CustomerRefreshResult<T> =
  | { ok: true; data: T }
  | { ok: false };

export async function refreshCustomerStatus<T>(refresh: () => Promise<T>): Promise<CustomerRefreshResult<T>> {
  try {
    return { ok: true, data: await refresh() };
  } catch {
    return { ok: false };
  }
}

export function formatLastChecked(timestamp?: number) {
  if (!timestamp) return null;
  return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(new Date(timestamp));
}

export function shouldPollCustomerStatus(status?: string) {
  return status !== "completed" && status !== "cancelled";
}
