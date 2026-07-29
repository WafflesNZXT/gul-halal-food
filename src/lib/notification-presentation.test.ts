import assert from "node:assert/strict";
import test from "node:test";
import type { NotificationDeliverySummary } from "../shared/notifications.js";
import { aggregateNotificationStatus } from "./notification-presentation.js";

const row = (status: NotificationDeliverySummary["status"]): NotificationDeliverySummary => ({
  channel: "email",
  notificationType: "admin_new_order",
  recipientType: "admin",
  status,
  attemptCount: 1,
});

test("notification delivery states use plain mobile-readable labels", () => {
  assert.equal(aggregateNotificationStatus([]), "Not configured");
  assert.equal(aggregateNotificationStatus([row("skipped_no_consent")]), "Not requested");
  assert.equal(aggregateNotificationStatus([row("pending")]), "Sending");
  assert.equal(aggregateNotificationStatus([row("sent")]), "Sent");
  assert.equal(aggregateNotificationStatus([row("sent"), row("sent")]), "Sent to 2 recipients");
  assert.equal(aggregateNotificationStatus([row("sent"), row("failed")]), "1 sent, 1 failed");
});
