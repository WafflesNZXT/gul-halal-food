import type { OrderStatus } from "@/shared/orders";

type StatusPresentation = {
  label: string;
  badgeClass: string;
  markerClass: string;
  textClass: string;
  selectionClass: string;
};

const presentations: Record<OrderStatus, StatusPresentation> = {
  pending: { label: "Pending", badgeClass: "border border-slate-300 bg-slate-100 text-slate-700", markerClass: "bg-slate-500 text-white", textClass: "text-slate-700", selectionClass: "border-slate-500 bg-slate-100 text-slate-800" },
  received: { label: "Received", badgeClass: "border border-sky-300 bg-sky-100 text-sky-800", markerClass: "bg-sky-600 text-white", textClass: "text-sky-800", selectionClass: "border-sky-500 bg-sky-100 text-sky-900" },
  reviewing: { label: "Reviewing", badgeClass: "border border-amber-300 bg-amber-100 text-amber-900", markerClass: "bg-amber-600 text-white", textClass: "text-amber-900", selectionClass: "border-amber-500 bg-amber-100 text-amber-950" },
  confirmed: { label: "Confirmed", badgeClass: "border border-teal-300 bg-teal-100 text-teal-900", markerClass: "bg-teal-600 text-white", textClass: "text-teal-900", selectionClass: "border-teal-500 bg-teal-100 text-teal-950" },
  preparing: { label: "Preparing", badgeClass: "border border-orange-300 bg-orange-100 text-orange-900", markerClass: "bg-orange-600 text-white", textClass: "text-orange-900", selectionClass: "border-orange-500 bg-orange-100 text-orange-950" },
  ready: { label: "Ready", badgeClass: "border border-indigo-300 bg-indigo-100 text-indigo-900", markerClass: "bg-indigo-600 text-white", textClass: "text-indigo-900", selectionClass: "border-indigo-500 bg-indigo-100 text-indigo-950" },
  completed: { label: "Completed", badgeClass: "border border-emerald-300 bg-emerald-100 text-emerald-900", markerClass: "bg-emerald-700 text-white", textClass: "text-emerald-900", selectionClass: "border-emerald-600 bg-emerald-100 text-emerald-950" },
  cancelled: { label: "Cancelled", badgeClass: "border border-destructive/40 bg-destructive/10 text-destructive", markerClass: "bg-destructive text-destructive-foreground", textClass: "text-destructive", selectionClass: "border-destructive bg-destructive/10 text-destructive" },
};

export function getOrderStatusPresentation(status: OrderStatus) {
  return presentations[status];
}

export function getOrderStatusLabel(status: OrderStatus) {
  return presentations[status].label;
}

export const inactiveOrderStatusClass = "bg-muted text-muted-foreground";
