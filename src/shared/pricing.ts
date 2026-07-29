export type PricedLine = {
  name: string;
  peopleCount: number;
  unitPriceCents?: number | null;
  lineTotalCents?: number | null;
};
export type PricingSummary = {
  lines: Array<PricedLine & { lineTotalCents?: number }>;
  knownSubtotalCents: number;
  totalCents?: number;
  label: "Calculated Total" | "Known Subtotal" | "Final Total" | "Final Quoted Total";
  finalPending: boolean;
};

export function resolveLineTotalCents(line: PricedLine) {
  const priced = Number.isSafeInteger(line.unitPriceCents) && (line.unitPriceCents ?? -1) >= 0;
  if (!priced) return undefined;
  const savedLineTotal = Number.isSafeInteger(line.lineTotalCents) && (line.lineTotalCents ?? -1) >= 0
    ? line.lineTotalCents!
    : undefined;
  const lineTotalCents = savedLineTotal ?? line.unitPriceCents! * line.peopleCount;
  if (!Number.isSafeInteger(lineTotalCents)) throw new RangeError("Pricing total exceeds the safe integer range.");
  return lineTotalCents;
}

export function summarizePricing(lines: PricedLine[], quotedTotalCents?: number | null): PricingSummary {
  const resolved = lines.map((line) => {
    const lineTotalCents = resolveLineTotalCents(line);
    return { ...line, lineTotalCents };
  });
  const knownSubtotalCents = resolved.reduce((sum, line) => sum + (line.lineTotalCents ?? 0), 0);
  if (Number.isSafeInteger(quotedTotalCents) && (quotedTotalCents ?? -1) >= 0) return { lines: resolved, knownSubtotalCents, totalCents: quotedTotalCents!, label: "Final Quoted Total", finalPending: false };
  if (resolved.length > 0 && resolved.every((line) => line.lineTotalCents !== undefined)) return { lines: resolved, knownSubtotalCents, totalCents: knownSubtotalCents, label: "Calculated Total", finalPending: false };
  return { lines: resolved, knownSubtotalCents, label: knownSubtotalCents > 0 ? "Known Subtotal" : "Final Total", finalPending: true };
}

export function formatCents(cents: number) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100); }

export function pricingSummaryLines(summary: PricingSummary) {
  if (summary.label === "Final Quoted Total") return [`Final Quoted Total: ${formatCents(summary.totalCents!)}`];
  if (!summary.finalPending) return [`Calculated Total: ${formatCents(summary.totalCents!)}`];
  if (summary.knownSubtotalCents > 0) return [`Known Subtotal: ${formatCents(summary.knownSubtotalCents)}`, "Final Total: Pending"];
  return ["Final Total: Pending"];
}
