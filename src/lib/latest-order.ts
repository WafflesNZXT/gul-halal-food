export const LATEST_ORDER_KEY = "gul-latest-order";
export type LatestOrder = { reference: string; statusUrl: string };

const referencePattern = /^GHF-\d{4}-[A-Z0-9]{6}$/;
const tokenPattern = /^[A-Za-z0-9_-]{43,128}$/;

export function isSafeStatusUrl(value: unknown, origin: string): value is string {
  return toSafeAbsoluteStatusUrl(value, origin) !== null;
}

export function toSafeAbsoluteStatusUrl(value: unknown, origin: string): string | null {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value, origin);
    const token = /^\/order-status\/([^/]+)$/.exec(url.pathname)?.[1];
    return url.origin === new URL(origin).origin
      && !url.search
      && !url.hash
      && token
      && tokenPattern.test(token)
      ? url.toString()
      : null;
  } catch { return null; }
}

export function readLatestOrder(storage: Pick<Storage, "getItem" | "removeItem">, origin: string): LatestOrder | null {
  try {
    const raw = storage.getItem(LATEST_ORDER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { reference?: unknown; statusUrl?: unknown };
    if (typeof parsed.reference !== "string" || !referencePattern.test(parsed.reference) || !isSafeStatusUrl(parsed.statusUrl, origin)) throw new Error("Invalid saved order");
    return { reference: parsed.reference, statusUrl: parsed.statusUrl };
  } catch { try { storage.removeItem(LATEST_ORDER_KEY); } catch { /* Storage may be disabled. */ } return null; }
}

export function forgetLatestOrder(storage: Pick<Storage, "removeItem">) { storage.removeItem(LATEST_ORDER_KEY); }
