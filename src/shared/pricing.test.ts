import assert from "node:assert/strict";
import test from "node:test";
import { summarizePricing } from "./pricing.js";

test("pricing uses integer cents, quantities, pending states, and authoritative quotes", () => {
  const all = summarizePricing([{ name: "Biryani", peopleCount: 50, unitPriceCents: 1200 }, { name: "Keer", peopleCount: 50, unitPriceCents: 400 }]);
  assert.equal(all.totalCents, 80000); assert.equal(all.label, "Calculated Total");
  const partial = summarizePricing([{ name: "Biryani", peopleCount: 50, unitPriceCents: 1200 }, { name: "Keer", peopleCount: 50 }]);
  assert.equal(partial.knownSubtotalCents, 60000); assert.equal(partial.finalPending, true);
  assert.equal(summarizePricing([{ name: "Keer", peopleCount: 50 }]).label, "Final Total");
  assert.equal(summarizePricing([{ name: "Biryani", peopleCount: 50, unitPriceCents: 1200 }], 45000).label, "Final Quoted Total");
});

test("saved line-total snapshots take precedence over later unit-price changes", () => {
  const historical = summarizePricing([{
    name: "Biryani",
    peopleCount: 50,
    unitPriceCents: 1300,
    lineTotalCents: 60000,
  }]);
  assert.equal(historical.knownSubtotalCents, 60000);
  assert.equal(historical.totalCents, 60000);
});
