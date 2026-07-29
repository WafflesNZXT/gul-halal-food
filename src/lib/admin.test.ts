import assert from "node:assert/strict";
import test from "node:test";
import { formatAdminCurrency, formatAdminDishDetails, parseDollarsToCents } from "./admin.js";

test("admin currency helpers safely convert and format cents", () => {
  assert.equal(parseDollarsToCents("1275.50"), 127550);
  assert.equal(parseDollarsToCents("450"), 45000);
  assert.equal(parseDollarsToCents("-1"), undefined);
  assert.equal(formatAdminCurrency(127550), "$1,275.50");
});

test("admin dish details omit a non-spicy spice level", () => {
  assert.equal(formatAdminDishDetails({ spiceLevel: 0, extras: {} }), "Standard preparation");
  assert.equal(formatAdminDishDetails({ proteinLabel: "Chicken", spiceLevel: 2, extras: { riceType: "Basmati" } }), "Chicken · Spice level 2 · Basmati");
});
