import assert from "node:assert/strict";
import test from "node:test";
import { forgetLatestOrder, LATEST_ORDER_KEY, readLatestOrder } from "./latest-order.js";

class MemoryStorage {
  values = new Map<string, string>();
  getItem(key: string) { return this.values.get(key) ?? null; }
  removeItem(key: string) { this.values.delete(key); }
}

const origin = "https://gul.example";
const valid = { reference: "GHF-2026-ABC123", statusUrl: `/order-status/${"A".repeat(43)}` };

test("latest-order recovery accepts only a same-origin secure status route", () => {
  const storage = new MemoryStorage();
  storage.values.set(LATEST_ORDER_KEY, JSON.stringify(valid));
  assert.deepEqual(readLatestOrder(storage, origin), valid);
});

test("latest-order recovery removes malformed and external values, while forget removes only its own key", () => {
  const storage = new MemoryStorage();
  storage.values.set(LATEST_ORDER_KEY, JSON.stringify({ ...valid, statusUrl: "https://other.example/order-status/token" }));
  storage.values.set("unrelated", "keep");
  assert.equal(readLatestOrder(storage, origin), null);
  assert.equal(storage.getItem(LATEST_ORDER_KEY), null);
  storage.values.set(LATEST_ORDER_KEY, "not json");
  assert.equal(readLatestOrder(storage, origin), null);
  storage.values.set(LATEST_ORDER_KEY, JSON.stringify(valid));
  forgetLatestOrder(storage);
  assert.equal(storage.getItem(LATEST_ORDER_KEY), null);
  assert.equal(storage.getItem("unrelated"), "keep");
});
