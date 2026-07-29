import assert from "node:assert/strict";
import test from "node:test";
import { formatLastChecked, refreshCustomerStatus, shouldPollCustomerStatus } from "./customer-status-refresh.js";

test("manual customer refresh calls its supplied request and returns its current data", async () => {
  let calls = 0;
  const result = await refreshCustomerStatus(async () => { calls += 1; return { reference: "GHF-2026-ABC123" }; });
  assert.equal(calls, 1);
  assert.deepEqual(result, { ok: true, data: { reference: "GHF-2026-ABC123" } });
});

test("a failed manual refresh does not produce replacement data", async () => {
  const result = await refreshCustomerStatus(async () => { throw new Error("temporary failure"); });
  assert.deepEqual(result, { ok: false });
});

test("last checked uses an en-US time and terminal statuses stop automatic polling", () => {
  assert.match(formatLastChecked(Date.UTC(2026, 0, 1, 13, 5)) ?? "", /^\d{1,2}:05 (AM|PM)$/);
  assert.equal(shouldPollCustomerStatus("received"), true);
  assert.equal(shouldPollCustomerStatus("completed"), false);
  assert.equal(shouldPollCustomerStatus("cancelled"), false);
});
