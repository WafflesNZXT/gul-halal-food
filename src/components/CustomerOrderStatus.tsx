import React from "react";
import { CheckCircle2, CircleAlert, Clock3 } from "lucide-react";
import type { CustomerOrder, OrderStatus } from "@/shared/orders";
import { getOrderStatusPresentation, inactiveOrderStatusClass } from "@/lib/order-status-presentation";

const timeline: OrderStatus[] = ["received", "reviewing", "confirmed", "preparing", "ready", "completed"];
const formatDate = (value: string, withTime = false) => new Intl.DateTimeFormat(undefined, withTime ? { dateStyle: "medium", timeStyle: "short" } : { dateStyle: "long" }).format(new Date(withTime ? value : `${value}T00:00:00`));
const titleCase = (value: string) => value.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

export function CustomerOrderStatus({ order, statusActions }: { order: CustomerOrder; statusActions?: React.ReactNode }) {
  const cancelled = order.status === "cancelled";
  const index = timeline.indexOf(order.status);
  const currentStatus = getOrderStatusPresentation(order.status);

  return <div className="space-y-8">
    <header className="rounded-3xl border border-border bg-card p-7 shadow-sm md:p-10">
      <p className="font-bold uppercase tracking-[0.18em] text-secondary">Order request</p>
      <div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><h1 className="text-4xl text-primary md:text-5xl">{order.reference}</h1><p className="mt-2 text-foreground/75">Received {formatDate(order.createdAt, true)}</p></div>
        <span className={`inline-flex w-fit rounded-full px-4 py-2 text-sm font-bold ${currentStatus.badgeClass}`}>{currentStatus.label}</span>
      </div>
      <p className="mt-5 text-foreground/75">Your request is recorded. Final availability and pricing will be confirmed separately.</p>
      {statusActions && <div className="mt-6">{statusActions}</div>}
    </header>
    <div className="grid gap-8 md:grid-cols-[1.1fr_.9fr]">
      <section className="rounded-3xl border border-border bg-card p-7 shadow-sm">
        <h2 className="text-2xl text-primary">Order details</h2>
        <dl className="mt-5 space-y-4 text-foreground/80">
          <div><dt className="text-sm font-semibold text-foreground/55">Event date</dt><dd>{formatDate(order.eventDate)}</dd></div>
          <div><dt className="text-sm font-semibold text-foreground/55">Event type</dt><dd>{titleCase(order.eventType)}</dd></div>
          <div><dt className="text-sm font-semibold text-foreground/55">Venue / city</dt><dd>{order.venue}</dd></div>
          <div><dt className="text-sm font-semibold text-foreground/55">Last updated</dt><dd>{formatDate(order.updatedAt, true)}</dd></div>
        </dl>
      </section>
      {cancelled ? <section className="rounded-3xl border border-destructive/30 bg-card p-7 shadow-sm"><h2 className="text-2xl text-primary">Status</h2><div className="mt-5 flex items-center gap-3 text-destructive"><CircleAlert /><span className="font-bold">This request was cancelled.</span></div></section> : <section className="rounded-3xl border border-border bg-card p-7 shadow-sm"><h2 className="text-2xl text-primary">Status timeline</h2><ol className="mt-5 space-y-4">{timeline.map((status, step) => {
        const history = order.statusHistory.find((entry) => entry.newStatus === status);
        const active = step <= index;
        const presentation = getOrderStatusPresentation(status);
        return <li key={status} className="flex gap-3"><span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${active ? presentation.markerClass : inactiveOrderStatusClass} ${status === order.status ? "ring-2 ring-offset-2 ring-current" : ""}`}>{active ? <CheckCircle2 size={15} /> : <Clock3 size={14} />}</span><div><p className={`font-semibold ${active ? presentation.textClass : "text-foreground/55"}`}>{presentation.label}</p>{history && <p className="text-xs text-foreground/55">{formatDate(history.changedAt, true)}</p>}</div></li>;
      })}</ol></section>}
    </div>
    <section className="rounded-3xl border border-border bg-card p-7 shadow-sm">
      <h2 className="text-2xl text-primary">Selected dishes</h2>
      <div className="mt-5 divide-y divide-border/70">{order.items.map((item) => <div key={`${item.menuItemId}-${item.peopleCount}-${item.proteinLabel ?? ""}`} className="py-4 first:pt-0"><div className="flex flex-wrap items-baseline justify-between gap-2"><h3 className="font-display text-xl text-primary">{item.name}</h3><span className="font-semibold text-foreground/70">{item.peopleCount} {item.peopleCount === 1 ? "person" : "people"}</span></div><p className="mt-1 text-sm text-foreground/70">{[item.proteinLabel, item.spiceLevel > 0 ? `Spice level ${item.spiceLevel}` : undefined, ...Object.values(item.extras)].filter(Boolean).join(" · ") || "Standard preparation"}</p><p className="mt-1 text-xs text-foreground/55">{item.pricingLabel}</p></div>)}</div>
    </section>
  </div>;
}
