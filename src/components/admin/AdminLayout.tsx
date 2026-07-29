import React from "react";
import { Link, useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/admin";

export function AdminLayout({ title, backHref, children }: { title: string; backHref?: string; children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [busy, setBusy] = React.useState(false);
  const reference = /^\/admin\/orders\/(GHF-\d{4}-[A-Z0-9]{6})$/.exec(location)?.[1];
  const logout = async () => { setBusy(true); try { await adminApi.logout(); } finally { queryClient.removeQueries({ queryKey: ["admin"] }); setLocation("/admin/login"); setBusy(false); } };
  const copyReference = async () => { if (!reference) return; try { await navigator.clipboard.writeText(reference); } catch { /* The visible reference can still be copied manually. */ } };
  return <main className="min-h-screen bg-[#fff9ed] px-4 py-5 text-foreground sm:px-6"><div className="mx-auto max-w-5xl"><header className="mb-7 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-primary/20 bg-white px-5 py-4 shadow-sm"><div>{backHref && <Link href={backHref} className="mb-2 inline-flex min-h-11 items-center font-semibold text-primary underline">Back to orders</Link>}<p className="font-display text-xl text-primary">Gul Halal Food</p><h1 className="text-3xl font-bold text-primary sm:text-4xl">{title}</h1></div><div className="flex flex-wrap gap-3">{reference && <button type="button" onClick={copyReference} className="min-h-12 rounded-xl border border-primary px-4 font-bold text-primary focus-visible:outline focus-visible:outline-4 focus-visible:outline-secondary">Copy Order Reference</button>}<button type="button" onClick={logout} disabled={busy} className="min-h-12 rounded-xl bg-primary px-5 font-bold text-white focus-visible:outline focus-visible:outline-4 focus-visible:outline-secondary disabled:cursor-not-allowed disabled:opacity-60">{busy ? "Logging out…" : "Log out"}</button></div></header>{children}</div></main>;
}
