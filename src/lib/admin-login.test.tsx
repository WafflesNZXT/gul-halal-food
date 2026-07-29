import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { StaffLoginLink } from "../components/StaffLoginLink.js";
import { ADMIN_ORDERS_ROUTE, getAdminLoginViewState } from "./admin-login.js";

test("public footer staff link is visible and points to the existing admin login route", () => {
  const markup = renderToStaticMarkup(React.createElement(StaffLoginLink));
  assert.match(markup, />Staff Login</);
  assert.match(markup, /href="\/admin\/login"/);
});

test("admin login session state redirects authenticated users and retains the form for signed-out users", () => {
  assert.equal(getAdminLoginViewState({ isLoading: true, isFetching: true, isSuccess: false }), "checking");
  assert.equal(getAdminLoginViewState({ isLoading: false, isFetching: true, isSuccess: true }), "checking");
  assert.equal(getAdminLoginViewState({ isLoading: false, isFetching: false, isSuccess: true }), "authenticated");
  assert.equal(getAdminLoginViewState({ isLoading: false, isFetching: false, isSuccess: false }), "unauthenticated");
  assert.equal(ADMIN_ORDERS_ROUTE, "/admin/orders");
});
