import assert from "node:assert/strict";
import test from "node:test";
import { ORDER_STATUSES } from "@/shared/orders";
import { getOrderStatusPresentation, inactiveOrderStatusClass } from "./order-status-presentation.js";

test("each order status has a distinct semantic presentation and cancellation is destructive", () => {
  const classes = ORDER_STATUSES.map((status) => getOrderStatusPresentation(status).markerClass);
  assert.equal(new Set(classes).size, classes.length);
  assert.match(getOrderStatusPresentation("cancelled").badgeClass, /destructive/);
  assert.match(inactiveOrderStatusClass, /muted/);
  for (const status of ORDER_STATUSES) assert.ok(getOrderStatusPresentation(status).label.length > 0);
});
