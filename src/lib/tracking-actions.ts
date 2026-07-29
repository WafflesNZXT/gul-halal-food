import { toSafeAbsoluteStatusUrl } from "./latest-order.js";

export type TrackingActionResult = "shared" | "cancelled" | "copied" | "manual";
type ClipboardLike = { writeText?(text: string): Promise<void> };
type ShareLike = { share?(data: { title: string; text: string; url: string }): Promise<void> };

export async function copyTextSafely(text: string, clipboard: ClipboardLike | undefined = typeof navigator === "undefined" ? undefined : navigator.clipboard) {
  try { if (!clipboard?.writeText) return false; await clipboard.writeText(text); return true; } catch { return false; }
}

export async function shareTrackingLink(reference: string, statusUrl: unknown, origin: string, navigatorLike: ShareLike | undefined = typeof navigator === "undefined" ? undefined : navigator, clipboard: ClipboardLike | undefined = typeof navigator === "undefined" ? undefined : navigator.clipboard) : Promise<TrackingActionResult> {
  const url = toSafeAbsoluteStatusUrl(statusUrl, origin);
  if (!url) return "manual";
  const data = { title: "Gul Halal Food Order Status", text: `Track Gul Halal Food order ${reference}.`, url };
  if (navigatorLike?.share) {
    try { await navigatorLike.share(data); return "shared"; } catch (error) { if ((error as { name?: string }).name === "AbortError") return "cancelled"; }
  }
  return await copyTextSafely(url, clipboard) ? "copied" : "manual";
}
