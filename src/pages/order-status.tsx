import React from "react";
import { Layout } from "@/components/Layout";
import { Link } from "wouter";

export default function OrderStatusPage() {
  return <Layout><section className="bg-background px-4 pb-24 pt-36 text-center"><div className="mx-auto max-w-xl rounded-3xl border border-border bg-card p-10 shadow-sm"><h1 className="text-4xl text-primary">Order status</h1><p className="mt-4 text-foreground/75">Online order status is not available until the secure ordering service is connected.</p><Link href="/quote" className="mt-7 inline-block font-bold text-primary underline-offset-4 hover:underline">Return to order request</Link></div></section></Layout>;
}
