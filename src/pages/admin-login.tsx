import React from "react";
import { useLocation } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { adminApi } from "@/lib/admin";
import { ADMIN_ORDERS_ROUTE, getAdminLoginViewState } from "@/lib/admin-login";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const session = useQuery({
    queryKey: ["admin", "session"],
    queryFn: adminApi.session,
    retry: false,
    staleTime: 60_000,
    refetchOnMount: "always",
  });
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const signIn = async (event: React.FormEvent) => { event.preventDefault(); setBusy(true); setError(""); try { await adminApi.login(username, password); await queryClient.invalidateQueries({ queryKey: ["admin", "session"] }); setLocation(ADMIN_ORDERS_ROUTE); } catch { setError("The username or password is not correct."); } finally { setBusy(false); } };
  const viewState = getAdminLoginViewState(session);

  React.useEffect(() => {
    if (viewState === "authenticated") setLocation(ADMIN_ORDERS_ROUTE);
  }, [setLocation, viewState]);

  return <div className="min-h-screen bg-[#fff9ed]"><Navbar /><main id="main-content" tabIndex={-1} className="grid min-h-screen place-items-center px-4 pb-8 pt-28 focus:outline-none">{viewState !== "unauthenticated" ? <div aria-live="polite" aria-busy="true" className="rounded-2xl bg-white p-6 text-center text-lg font-semibold text-primary shadow-sm">{viewState === "checking" ? "Checking your staff sign-in..." : "Opening your orders..."}</div> : <form onSubmit={signIn} className="w-full max-w-md rounded-3xl border border-primary/20 bg-white p-6 shadow-lg sm:p-8"><p className="font-display text-xl text-primary">Gul Halal Food</p><h1 className="mt-2 text-4xl font-bold text-primary">Admin sign in</h1><p className="mt-3 text-base text-foreground/75">For Gul Halal Food administrators only.</p>{error && <p role="alert" className="mt-5 rounded-xl bg-destructive/10 p-4 text-base text-destructive">{error}</p>}<label className="mt-7 block text-lg font-semibold" htmlFor="admin-username">Username</label><input id="admin-username" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-primary/30 px-4 text-lg focus-visible:outline focus-visible:outline-4 focus-visible:outline-secondary" required /><label className="mt-5 block text-lg font-semibold" htmlFor="admin-password">Password</label><input id="admin-password" type={showPassword ? "text" : "password"} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-primary/30 px-4 text-lg focus-visible:outline focus-visible:outline-4 focus-visible:outline-secondary" required /><button type="button" onClick={() => setShowPassword((value) => !value)} className="mt-3 min-h-11 font-semibold text-primary underline">{showPassword ? "Hide password" : "Show password"}</button><button disabled={busy} className="mt-7 min-h-12 w-full rounded-xl bg-primary px-5 text-lg font-bold text-white focus-visible:outline focus-visible:outline-4 focus-visible:outline-secondary disabled:cursor-not-allowed disabled:opacity-60">{busy ? "Signing in..." : "Sign in"}</button></form>}</main></div>;
}
