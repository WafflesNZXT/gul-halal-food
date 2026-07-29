# Order notifications

Order notifications run only after the order and its item snapshots have been
committed to PostgreSQL. The API waits for the bounded notification attempts
before returning so Vercel does not terminate unawaited work. Twilio and Resend
requests have strict timeouts, and any delivery or delivery-recording failure
is isolated from the successfully created order.

## Safe delivery mode

`NOTIFICATION_DELIVERY_MODE` defaults to `disabled`.

In disabled mode, templates are built and idempotent delivery rows are recorded
as `not_configured`, but no Twilio or Resend request is made. Automated tests
inject mock providers and do not use live credentials.

Live delivery requires all of the following:

- `NOTIFICATION_DELIVERY_MODE=live`
- Twilio: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and
  `TWILIO_MESSAGING_SERVICE_SID`
- Resend: `RESEND_API_KEY` and a verified `EMAIL_FROM`
- Optional administrator recipients in comma-separated
  `ADMIN_NOTIFICATION_PHONES` and `ADMIN_NOTIFICATION_EMAILS`

Customer email is independent of text-message consent. Customer text messages
are attempted only when the submitted order saved `sms_consent=true`.

## Local mocked verification

Keep `NOTIFICATION_DELIVERY_MODE=disabled` in `.env`, then run:

```powershell
npm test
```

The notification tests use in-memory delivery records and injected provider
adapters to cover success, failure, timeout, consent, and idempotency without
contacting Twilio or Resend.

For a local UI check, apply the migration only to a disposable/local Neon
branch, start `npm run dev`, create an order, and open its protected admin
detail page. The Notifications card should truthfully show `Not configured`
or `Not requested`.

## Deliberate migration

Do not run migrations during a Vercel build or Function invocation. Set the
direct Neon URL for the intended database, then run:

```powershell
$env:DATABASE_MIGRATION_URL = "<direct Neon migration URL>"
npm run db:migrate
```

The migration adds SMS consent fields, integer-cent item price snapshots, and
the idempotent `notification_deliveries` table.

## Vercel Preview

1. Use a separate Preview Neon database or branch.
2. Add all required database and administrator variables to the Vercel Preview
   environment.
3. Initially set `NOTIFICATION_DELIVERY_MODE=disabled`.
4. Apply the migration once to the Preview database with its direct URL.
5. Deploy and verify order creation, customer tracking, and the admin
   Notifications card.
6. Add Twilio/Resend credentials and test-only administrator recipients.
7. Change Preview to `NOTIFICATION_DELIVERY_MODE=live` only when a deliberate
   real-message test is approved, then redeploy.

## Vercel Production

1. Apply the migration once to Production using the direct Neon migration URL.
2. Add provider credentials and verified administrator recipients to the
   Production environment.
3. Confirm the Resend sender domain and Twilio Messaging Service are ready.
4. Set `NOTIFICATION_DELIVERY_MODE=live`.
5. Deploy Production and create one deliberate low-risk order request.
6. Confirm the customer-consent rule and each administrator delivery status in
   the protected order detail.

Keep Preview and Production credentials scoped to their respective Vercel
environments. None of these variables may use a `VITE_` prefix.

## Current limitations

- There is no manual resend control.
- A failed or not-configured delivery is retried only when dispatch is invoked
  again; no background queue or scheduled retry worker exists yet.
- A Function interruption after a row is claimed can leave it `pending`; this
  intentionally prevents duplicate messages until a future stale-claim policy
  or durable queue is introduced.
- Provider delivery receipts, customer STOP webhook processing, status-change
  notifications, invoices, and payments are later phases.
