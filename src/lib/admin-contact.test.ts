import assert from "node:assert/strict";
import test from "node:test";
import { normalizePhoneForAction, safeAdminEmail } from "./admin-contact.js";

test("admin contact actions retain a leading international plus and remove presentation punctuation", () => {
  assert.equal(normalizePhoneForAction("+1 (510) 731-8687"), "+15107318687");
  assert.equal(normalizePhoneForAction("510-731-8687"), "5107318687");
  assert.equal(normalizePhoneForAction("510-ABC-8687"), null);
  assert.equal(safeAdminEmail("customer@example.com"), "customer@example.com");
  assert.equal(safeAdminEmail("not-an-email"), null);
});
