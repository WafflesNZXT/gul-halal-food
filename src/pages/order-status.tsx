import React from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { CircleAlert, LoaderCircle } from "lucide-react";
import { Layout } from "@/components/Layout";
import { CustomerOrderStatus } from "@/components/CustomerOrderStatus";
import { CustomerTrackingActions } from "@/components/CustomerTrackingActions";
import { fetchOrderStatus } from "@/lib/order";
import type { CustomerOrder } from "@/shared/orders";

export default function OrderStatusPage() {
  const [, params] = useRoute("/order-status/:token");
  const token = params?.token ?? "";
  const query = useQuery({ queryKey: ["order-status", token], queryFn: () => fetchOrderStatus(token), enabled: Boolean(token), refetchInterval: (current) => { const status = (current.state.data as CustomerOrder | undefined)?.status; return status === "completed" || status === "cancelled" ? false : 45_000; } });
  return <Layout><section className="bg-background px-4 pb-24 pt-36 md:px-6"><div className="mx-auto max-w-3xl">{query.isLoading && <StatusPanel icon={<LoaderCircle className="animate-spin text-primary" />} title="Loading order status" description="Retrieving your order request securely." />}{query.isError && <StatusPanel icon={<CircleAlert className="text-secondary" />} title={(query.error as { status?: number }).status === 404 ? "Order not found" : "Unable to load order status"} description={(query.error as { status?: number }).status === 404 ? "This secure order link is invalid or is no longer available." : "Please try again shortly."} />}{query.data && <div className="space-y-6 md:space-y-8"><CustomerTrackingActions reference={query.data.reference} statusUrl={`/order-status/${token}`} /><CustomerOrderStatus order={query.data} /></div>}</div></section></Layout>;
}

function StatusPanel({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) { return <div className="rounded-3xl border border-border bg-card p-10 text-center shadow-sm"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">{icon}</div><h1 className="mt-5 text-4xl text-primary">{title}</h1><p className="mx-auto mt-4 max-w-lg text-foreground/75">{description}</p><Link href="/quote" className="mt-7 inline-block font-bold text-primary underline-offset-4 hover:underline">Return to order request</Link></div>; }
