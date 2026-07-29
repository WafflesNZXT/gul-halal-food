import React from "react";
import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { CustomerOrderStatus } from "@/components/CustomerOrderStatus";
import { CustomerStatusRefresh } from "@/components/CustomerStatusRefresh";
import { CustomerTrackingActions } from "@/components/CustomerTrackingActions";
import { forgetLatestOrder, readLatestOrder, type LatestOrder } from "@/lib/latest-order";
import { lookupOrder } from "@/lib/order";
import type { CustomerOrder } from "@/shared/orders";

function lookupErrorMessage(lookupError: unknown) {
  const status = (lookupError as { status?: number }).status;
  if (status === 429) return "Too many attempts. Please wait a few minutes and try again.";
  if (status === 500 || status === 503) return "Order tracking is temporarily unavailable. Please try again.";
  if (status === 403) return "This request was not accepted. Please try again from the Gul Halal Food website.";
  return "We could not find an order matching those details.";
}

export default function TrackOrder() {
  const [latest, setLatest] = React.useState<LatestOrder | null>(null);
  const [reference, setReference] = React.useState("");
  const [contact, setContact] = React.useState("");
  const [order, setOrder] = React.useState<CustomerOrder | null>(null);
  const [lastCheckedAt, setLastCheckedAt] = React.useState<number>();
  const [error, setError] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => { setLatest(readLatestOrder(localStorage, window.location.origin)); }, []);

  const getLookupValues = () => ({ reference: reference.trim().toUpperCase(), contact: contact.trim() });
  const fetchManualOrder = async () => {
    const values = getLookupValues();
    const result = await lookupOrder(values.reference, values.contact);
    setOrder(result);
    setLastCheckedAt(Date.now());
    return result;
  };
  const findOrder = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    setOrder(null);
    setLastCheckedAt(undefined);
    try { await fetchManualOrder(); } catch (lookupError) { setError(lookupErrorMessage(lookupError)); } finally { setBusy(false); }
  };
  const forget = () => { forgetLatestOrder(localStorage); setLatest(null); };

  if (order) return <Layout><section className="bg-background px-4 pb-24 pt-36 md:px-6"><div className="mx-auto max-w-3xl"><div className="mb-6 flex flex-wrap items-center justify-between gap-4"><div><h1 className="text-4xl text-primary">Track Your Order</h1><p className="mt-2 text-lg text-foreground/75">Here is the latest information for your order request.</p></div><button type="button" onClick={() => { setOrder(null); setLastCheckedAt(undefined); }} className="min-h-12 rounded-xl border border-primary px-5 text-lg font-bold text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">Find another order</button></div><div className="space-y-6 md:space-y-8"><CustomerTrackingActions reference={order.reference} compact /><CustomerOrderStatus order={order} statusActions={<CustomerStatusRefresh lastCheckedAt={lastCheckedAt} onRefresh={fetchManualOrder} />} /></div></div></section></Layout>;

  return <Layout><section className="bg-background px-4 pb-24 pt-36 md:px-6"><div className="mx-auto max-w-2xl"><header className="text-center"><h1 className="text-4xl text-primary md:text-5xl">Track Your Order</h1><p className="mx-auto mt-4 max-w-xl text-lg text-foreground/75">Check the latest status of your Gul Halal Food order request.</p></header>{latest && <section className="mt-10 rounded-3xl border border-primary/20 bg-card p-6 shadow-sm"><h2 className="text-2xl text-primary">Your Latest Order</h2><p className="mt-3 text-lg"><span className="font-semibold">Reference:</span> {latest.reference}</p><CustomerTrackingActions reference={latest.reference} statusUrl={latest.statusUrl} showViewButton compact /><div className="mt-4 border-t border-primary/15 pt-4"><button type="button" onClick={forget} className="min-h-11 font-semibold text-primary underline">Forget This Order</button></div></section>}<section className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-sm"><h2 className="text-3xl text-primary">Find Another Order</h2><p className="mt-3 text-lg text-foreground/75">Enter your order reference and the email address or phone number you used for the order.</p><form onSubmit={findOrder} className="mt-6 space-y-5"><div><label htmlFor="tracking-reference" className="block text-lg font-semibold">Order reference</label><input id="tracking-reference" value={reference} onChange={(event) => setReference(event.target.value.toUpperCase())} placeholder="GHF-2026-ABC123" className="mt-2 min-h-12 w-full rounded-xl border border-primary/30 px-4 text-lg uppercase" required /></div><div><label htmlFor="tracking-contact" className="block text-lg font-semibold">Email address or phone number</label><input id="tracking-contact" value={contact} onChange={(event) => setContact(event.target.value)} placeholder="Email or phone used for this order" className="mt-2 min-h-12 w-full rounded-xl border border-primary/30 px-4 text-lg" required /></div>{error && <p role="alert" className="rounded-xl bg-destructive/10 p-4 text-lg text-destructive">{error}</p>}<button disabled={busy} className="min-h-12 w-full rounded-xl bg-primary px-5 text-lg font-bold text-white disabled:cursor-not-allowed disabled:opacity-60">{busy ? "Finding your order..." : "Find My Order"}</button></form></section><p className="mt-6 text-center text-base text-foreground/65">Need to request catering? <Link href="/quote" className="font-semibold text-primary underline">Request a quote</Link></p></div></section></Layout>;
}
