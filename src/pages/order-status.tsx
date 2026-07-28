import React from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Clock3, CircleAlert, LoaderCircle } from "lucide-react";
import { Layout } from "@/components/Layout";
import { fetchOrderStatus } from "@/lib/order";
import type { CustomerOrder, OrderStatus } from "@/shared/orders";

const timeline: OrderStatus[] = ["received", "reviewing", "confirmed", "preparing", "ready", "completed"];

function formatDate(value: string, withTime = false) {
  return new Intl.DateTimeFormat(undefined, withTime ? { dateStyle: "medium", timeStyle: "short" } : { dateStyle: "long" }).format(new Date(withTime ? value : `${value}T00:00:00`));
}

function titleCase(value: string) {
  return value.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function OrderStatusPage() {
  const [, params] = useRoute("/order-status/:token");
  const token = params?.token ?? "";
  const query = useQuery({
    queryKey: ["order-status", token],
    queryFn: () => fetchOrderStatus(token),
    enabled: Boolean(token),
    refetchInterval: (current) => {
      const status = (current.state.data as CustomerOrder | undefined)?.status;
      return status === "completed" || status === "cancelled" ? false : 45_000;
    },
  });

  return <Layout><section className="bg-background px-4 pb-24 pt-36 md:px-6"><div className="mx-auto max-w-3xl">
    {query.isLoading && <StatusPanel icon={<LoaderCircle className="animate-spin text-primary" />} title="Loading order status" description="Retrieving your order request securely." />}
    {query.isError && <StatusPanel icon={<CircleAlert className="text-secondary" />} title={(query.error as { status?: number }).status === 404 ? "Order not found" : "Unable to load order status"} description={(query.error as { status?: number }).status === 404 ? "This secure order link is invalid or is no longer available." : "Please try again shortly."} />}
    {query.data && <OrderStatusContent order={query.data} />}
  </div></section></Layout>;
}

function StatusPanel({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return <div className="rounded-3xl border border-border bg-card p-10 text-center shadow-sm"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">{icon}</div><h1 className="mt-5 text-4xl text-primary">{title}</h1><p className="mx-auto mt-4 max-w-lg text-foreground/75">{description}</p><Link href="/quote" className="mt-7 inline-block font-bold text-primary underline-offset-4 hover:underline">Return to order request</Link></div>;
}

function OrderStatusContent({ order }: { order: CustomerOrder }) {
  const cancelled = order.status === "cancelled";
  const currentIndex = timeline.indexOf(order.status);
  return <div className="space-y-8"><header className="rounded-3xl border border-border bg-card p-7 shadow-sm md:p-10"><p className="font-bold uppercase tracking-[0.18em] text-secondary">Order request</p><div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><h1 className="text-4xl text-primary md:text-5xl">{order.reference}</h1><p className="mt-2 text-foreground/75">Received {formatDate(order.createdAt, true)}</p></div><span className={`inline-flex w-fit rounded-full px-4 py-2 text-sm font-bold ${cancelled ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}>{titleCase(order.status)}</span></div><p className="mt-5 text-foreground/75">Your request is recorded. Final availability and pricing will be confirmed separately.</p></header>
    <div className="grid gap-8 md:grid-cols-[1.1fr_.9fr]"><section className="rounded-3xl border border-border bg-card p-7 shadow-sm"><h2 className="text-2xl text-primary">Order details</h2><dl className="mt-5 space-y-4 text-foreground/80"><div><dt className="text-sm font-semibold text-foreground/55">Event date</dt><dd>{formatDate(order.eventDate)}</dd></div><div><dt className="text-sm font-semibold text-foreground/55">Event type</dt><dd>{titleCase(order.eventType)}</dd></div><div><dt className="text-sm font-semibold text-foreground/55">Venue / city</dt><dd>{order.venue}</dd></div><div><dt className="text-sm font-semibold text-foreground/55">Last updated</dt><dd>{formatDate(order.updatedAt, true)}</dd></div></dl></section><StatusTimeline order={order} /></div>
    <section className="rounded-3xl border border-border bg-card p-7 shadow-sm"><h2 className="text-2xl text-primary">Selected dishes</h2><div className="mt-5 divide-y divide-border/70">{order.items.map((item) => <div key={`${item.menuItemId}-${item.peopleCount}-${item.proteinLabel ?? ""}`} className="py-4 first:pt-0"><div className="flex flex-wrap items-baseline justify-between gap-2"><h3 className="font-display text-xl text-primary">{item.name}</h3><span className="font-semibold text-foreground/70">{item.peopleCount} {item.peopleCount === 1 ? "person" : "people"}</span></div><p className="mt-1 text-sm text-foreground/70">{[item.proteinLabel, `Spice level ${item.spiceLevel}`, ...Object.values(item.extras)].filter(Boolean).join(" · ") || "Standard preparation"}</p><p className="mt-1 text-xs text-foreground/55">{item.pricingLabel}</p></div>)}</div></section>
  </div>;
}

function StatusTimeline({ order }: { order: CustomerOrder }) {
  if (order.status === "cancelled") return <section className="rounded-3xl border border-destructive/30 bg-card p-7 shadow-sm"><h2 className="text-2xl text-primary">Status</h2><div className="mt-5 flex items-center gap-3 text-destructive"><CircleAlert /><span className="font-bold">This request was cancelled.</span></div></section>;
  const index = timeline.indexOf(order.status);
  return <section className="rounded-3xl border border-border bg-card p-7 shadow-sm"><h2 className="text-2xl text-primary">Status timeline</h2><ol className="mt-5 space-y-4">{timeline.map((status, step) => { const history = order.statusHistory.find((entry) => entry.newStatus === status); const active = step <= index; return <li key={status} className="flex gap-3"><span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${active ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>{active ? <CheckCircle2 size={15} /> : <Clock3 size={14} />}</span><div><p className={`font-semibold ${active ? "text-primary" : "text-foreground/55"}`}>{titleCase(status)}</p>{history && <p className="text-xs text-foreground/55">{formatDate(history.changedAt, true)}</p>}</div></li>; })}</ol></section>;
}
