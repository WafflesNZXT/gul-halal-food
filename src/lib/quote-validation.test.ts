import assert from "node:assert/strict";
import test from "node:test";
import { firstInvalidQuoteField, navigateToFirstInvalidQuoteField, quoteFormSchema } from "./quote-validation.js";

const valid = { fullName: "Jane Doe", email: "JANE@EXAMPLE.COM ", phone: "+1 510 731-8687", eventDate: "2026-07-30", eventType: "family", venue: "San Jose" };

test("quote validation trims useful fields and accepts common complete phone formats", () => {
  const result = quoteFormSchema.parse(valid);
  assert.equal(result.email, "jane@example.com");
  for (const phone of ["5107318687", "(510) 731-8687", "+1 510 731 8687"]) assert.equal(quoteFormSchema.safeParse({ ...valid, phone }).success, true);
});

test("quote validation rejects blank meaningful fields, malformed email, short phone, and letters in phone", () => {
  for (const value of ["", "  "]) assert.equal(quoteFormSchema.safeParse({ ...valid, fullName: value }).success, false);
  assert.equal(quoteFormSchema.safeParse({ ...valid, venue: "  " }).success, false);
  assert.equal(quoteFormSchema.safeParse({ ...valid, email: "not-an-email" }).success, false);
  assert.equal(quoteFormSchema.safeParse({ ...valid, phone: "510-73" }).success, false);
  assert.equal(quoteFormSchema.safeParse({ ...valid, phone: "510-ABC-8687" }).success, false);
});

test("invalid quote navigation scrolls and focuses the first field in visual order", () => {
  const calls: string[] = [];
  const element = { scrollIntoView: (options: ScrollIntoViewOptions) => calls.push(`scroll:${options.behavior}`) } as unknown as HTMLElement;
  const field = navigateToFirstInvalidQuoteField({ email: {}, fullName: {} }, (name) => calls.push(`focus:${name}`), false, { getElementById: () => element });
  assert.equal(field, "fullName");
  assert.deepEqual(calls, ["scroll:smooth", "focus:fullName"]);
  assert.equal(firstInvalidQuoteField({ venue: {} }), "venue");
});
