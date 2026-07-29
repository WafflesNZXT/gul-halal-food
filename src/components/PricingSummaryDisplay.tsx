import { formatCents, pricingSummaryLines, summarizePricing } from "@/shared/pricing";

type PricingItem = { name: string; peopleCount: number; unitPriceCents?: number; lineTotalCents?: number };

export function PricingSummaryDisplay({ items, quotedTotalCents, showItems = false }: { items: PricingItem[]; quotedTotalCents?: number; showItems?: boolean }) {
  const summary = summarizePricing(items, quotedTotalCents);
  return <div className="space-y-2">
    {showItems && <div className="space-y-2">{summary.lines.map((item, index) => <div key={`${item.name}-${index}`} className="flex flex-wrap justify-between gap-2 text-sm"><span>{item.name} · {item.peopleCount} people</span><span className="font-semibold">{item.unitPriceCents == null || item.lineTotalCents === undefined ? "Pricing pending" : `${formatCents(item.unitPriceCents)} per person · ${formatCents(item.lineTotalCents)}`}</span></div>)}</div>}
    <div className="border-t border-border/70 pt-2">{pricingSummaryLines(summary).map((line) => <p key={line} className="font-bold text-primary">{line}</p>)}</div>
  </div>;
}
