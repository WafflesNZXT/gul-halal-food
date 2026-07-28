import assert from "node:assert/strict";
import test from "node:test";
import { clearCartAfterSuccessfulSubmission } from "../lib/order";

test("cart is not cleared after a failed order submission", () => {
  let clearCount = 0;
  const cleared = clearCartAfterSuccessfulSubmission({ status: "error", message: "Network unavailable" }, () => { clearCount += 1; });
  assert.equal(cleared, false);
  assert.equal(clearCount, 0);
});

test("cart clears only after the server confirms a successful order", () => {
  let clearCount = 0;
  const cleared = clearCartAfterSuccessfulSubmission({
    status: "success",
    order: {
      reference: "GHF-2026-ABC123",
      status: "received",
      eventDate: "2026-08-01",
      eventType: "family",
      venue: "Community center",
      createdAt: "2026-07-28T00:00:00.000Z",
      updatedAt: "2026-07-28T00:00:00.000Z",
      items: [],
      statusHistory: [],
      statusUrl: "/order-status/token",
    },
  }, () => { clearCount += 1; });
  assert.equal(cleared, true);
  assert.equal(clearCount, 1);
});
