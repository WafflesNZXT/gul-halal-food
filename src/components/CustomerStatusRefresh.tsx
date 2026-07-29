import React from "react";
import { RefreshCw } from "lucide-react";
import { formatLastChecked, refreshCustomerStatus } from "@/lib/customer-status-refresh";

type CustomerStatusRefreshProps = {
  lastCheckedAt?: number;
  isRefreshing?: boolean;
  onRefresh: () => Promise<unknown>;
};

export function CustomerStatusRefresh({ lastCheckedAt, isRefreshing = false, onRefresh }: CustomerStatusRefreshProps) {
  const [running, setRunning] = React.useState(false);
  const [feedback, setFeedback] = React.useState("");
  const checking = running || isRefreshing;
  const lastChecked = formatLastChecked(lastCheckedAt);

  const refresh = async () => {
    if (checking) return;
    setRunning(true);
    setFeedback("");
    const result = await refreshCustomerStatus(onRefresh);
    setFeedback(result.ok ? "Order status updated." : "Could not refresh the order status. Try again.");
    setRunning(false);
  };

  return <div className="flex flex-wrap items-center gap-3" aria-busy={checking}>
    <button type="button" onClick={refresh} disabled={checking} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-primary px-5 text-base font-bold text-primary transition-colors hover:bg-primary/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60">
      <RefreshCw className={`h-5 w-5 ${checking ? "animate-spin motion-reduce:animate-none" : ""}`} aria-hidden="true" />
      {checking ? "Checking..." : "Refresh Status"}
    </button>
    {lastChecked && <p className="text-sm text-foreground/65">Last checked: {lastChecked}</p>}
    <p className="basis-full text-sm text-foreground/75" aria-live="polite" role="status">{feedback}</p>
  </div>;
}
