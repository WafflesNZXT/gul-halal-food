import type { NotificationDeliverySummary } from "@/shared/notifications";

export function aggregateNotificationStatus(rows: NotificationDeliverySummary[]) {
  if (!rows.length) return "Not configured";
  if (rows.length === 1 && rows[0].status === "skipped_no_consent") return "Not requested";
  const counts = new Map<string, number>();
  for (const row of rows) counts.set(row.status, (counts.get(row.status) ?? 0) + 1);
  if (counts.size === 1) {
    const [status, count] = [...counts][0];
    if (status === "sent") return count === 1 ? "Sent" : `Sent to ${count} recipients`;
    if (status === "pending") return "Sending";
    if (status === "not_configured") return "Not configured";
    if (status === "failed") return count === 1 ? "Failed" : `${count} failed`;
    return "Not requested";
  }
  const parts = [...counts].map(([status, count]) => {
    const label = status === "sent"
      ? "sent"
      : status === "failed"
        ? "failed"
        : status === "pending"
          ? "sending"
          : status === "not_configured"
            ? "not configured"
            : "not requested";
    return `${count} ${label}`;
  });
  return parts.join(", ");
}
