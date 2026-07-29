import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { CustomerTrackingActions } from "../components/CustomerTrackingActions.js";
import { isSafeStatusUrl, toSafeAbsoluteStatusUrl } from "./latest-order.js";
import { copyTextSafely, shareTrackingLink } from "./tracking-actions.js";

const origin = "https://gul.example";
const reference = "GHF-2026-539A1B";
const relativeUrl = `/order-status/${"A".repeat(43)}`;

test("tracking actions accept only same-origin customer status URLs", () => {
  assert.equal(isSafeStatusUrl(relativeUrl, origin), true);
  assert.equal(isSafeStatusUrl(`${origin}${relativeUrl}`, origin), true);
  assert.equal(toSafeAbsoluteStatusUrl(relativeUrl, origin), `${origin}${relativeUrl}`);
  for (const unsafe of ["https://outside.example/order-status/token", "javascript:alert(1)", "data:text/plain,hello", "/order-status/not-a-valid-token", `${relativeUrl}?redirect=outside`, "/quote"]) assert.equal(isSafeStatusUrl(unsafe, origin), false);
});

test("copying a reference copies only the reference", async () => {
  const copied: string[] = [];
  assert.equal(await copyTextSafely(reference, { writeText: async (value) => { copied.push(value); } }), true);
  assert.deepEqual(copied, [reference]);
});

test("web share receives only the reference and validated secure link", async () => {
  let payload: { title: string; text: string; url: string } | undefined;
  const result = await shareTrackingLink(reference, relativeUrl, origin, { share: async (value) => { payload = value; } });
  assert.equal(result, "shared");
  assert.deepEqual(payload, { title: "Gul Halal Food Order Status", text: `Track Gul Halal Food order ${reference}.`, url: `${origin}${relativeUrl}` });
  assert.doesNotMatch(payload!.text, /email|phone|venue|dish|price/i);
});

test("cancelled or unavailable sharing has the correct fallback behavior", async () => {
  const cancelled = await shareTrackingLink(reference, relativeUrl, origin, { share: async () => { throw Object.assign(new Error("cancelled"), { name: "AbortError" }); } });
  assert.equal(cancelled, "cancelled");
  const copied: string[] = [];
  const unsupported = await shareTrackingLink(reference, relativeUrl, origin, undefined, { writeText: async (value) => { copied.push(value); } });
  assert.equal(unsupported, "copied");
  assert.deepEqual(copied, [`${origin}${relativeUrl}`]);
  const manual = await shareTrackingLink(reference, relativeUrl, origin, undefined, { writeText: async () => { throw new Error("blocked"); } });
  assert.equal(manual, "manual");
});

test("tracking actions render sharing only when a validated raw status URL exists", () => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, "window");
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { location: { origin } },
  });
  try {
    const withToken = renderToStaticMarkup(React.createElement(CustomerTrackingActions, {
      reference,
      statusUrl: relativeUrl,
      showViewButton: true,
      compact: true,
    }));
    assert.match(withToken, />View Order Status</);
    assert.match(withToken, />Share Tracking Link</);
    assert.match(withToken, />Copy Order Reference</);

    const manuallyRecovered = renderToStaticMarkup(React.createElement(CustomerTrackingActions, {
      reference,
      compact: true,
    }));
    assert.doesNotMatch(manuallyRecovered, /Share Tracking Link|View Order Status/);
    assert.match(manuallyRecovered, /Copy Order Reference/);
  } finally {
    if (descriptor) Object.defineProperty(globalThis, "window", descriptor);
    else Reflect.deleteProperty(globalThis, "window");
  }
});
