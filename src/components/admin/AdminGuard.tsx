import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { adminApi } from "@/lib/admin";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();
  const session = useQuery({ queryKey: ["admin", "session"], queryFn: adminApi.session, retry: false, staleTime: 60_000 });
  React.useEffect(() => { if (session.isError) setLocation("/admin/login"); }, [session.isError, setLocation]);
  if (session.isLoading) return <main className="grid min-h-screen place-items-center bg-[#fff9ed] p-6 text-center text-lg text-primary">Checking your secure sign-in…</main>;
  if (session.isError) return <main className="grid min-h-screen place-items-center bg-[#fff9ed] p-6 text-center text-lg text-primary">Your sign-in has ended. Returning to the sign-in page…</main>;
  return <>{children}</>;
}
