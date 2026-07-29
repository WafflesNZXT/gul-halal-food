import type { AdminNotificationSummary } from "@/shared/notifications";
import { aggregateNotificationStatus } from "@/lib/notification-presentation";

export function AdminNotificationsCard({ notifications }: { notifications: AdminNotificationSummary }) {
  const rows = [
    ["Customer text message", notifications.customerSms],
    ["Customer email", notifications.customerEmail],
    ["Admin text message", notifications.adminSms],
    ["Admin email", notifications.adminEmail],
  ] as const;
  return <section className="rounded-3xl border border-primary/20 bg-white p-5 shadow-sm"><h2 className="text-2xl font-bold text-primary">Notifications</h2><dl className="mt-5 space-y-4">{rows.map(([label, deliveries]) => <div key={label} className="rounded-xl bg-[#fff9ed] p-4"><dt className="text-base font-semibold text-foreground/65">{label}</dt><dd className="mt-1 text-xl font-bold text-foreground">{aggregateNotificationStatus(deliveries)}</dd></div>)}</dl></section>;
}
