# Gul Halal Food admin orders

The phone-first admin area is available at `/admin/login`. It uses one shared administrator account and a secure, HttpOnly session cookie. No password, session token, customer status token, or customer information is stored in browser storage.

## First setup

1. Run `npm run admin:hash-password` in an interactive terminal. Enter the new password twice; the command prints a single `scrypt-v1$...` hash.
2. Set `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, and optionally `ADMIN_SESSION_TTL_HOURS` in the local `.env` file. Never put the plaintext password in an environment file.
3. For Vercel Preview and Production, add the same three variables in the Vercel project environment settings. Use separate Preview and Production values when appropriate.
4. Apply the deliberate database migration using a direct Neon migration URL. In PowerShell: `$env:DATABASE_MIGRATION_URL = "<direct Neon URL>"; npm run db:migrate`. Do this once per database; it is not run automatically by deploys or requests.

## Testing a Preview deployment

1. Confirm the migration is applied to the Preview database.
2. Set the three admin environment variables for Preview.
3. Open `/admin/login`, sign in, refresh `/admin/orders`, and confirm the session remains active.
4. Open a test order, save a status, note, and price, then check the customer status URL after its next refresh.
5. Log out and confirm `/admin/orders` returns to sign-in.

## Password rotation and lost phones

Generate a new password hash, replace `ADMIN_PASSWORD_HASH`, and redeploy. Existing sessions should then be revoked deliberately by deleting rows from `admin_sessions` with an approved database administration action. On a lost phone, rotate the password and revoke sessions immediately. The phone’s browser should also be logged out whenever it is no longer in the owners’ possession.

## Local commands

- `npm run dev` — Vite at port 5173 with the local Express API at `API_PORT` (default 5000).
- `npm run admin:hash-password` — create a secure password hash interactively.
- `npm run db:generate` — generate a migration after deliberate schema changes.
- `$env:DATABASE_MIGRATION_URL = "<direct Neon URL>"; npm run db:migrate` — deliberately apply migrations in PowerShell.

The current phase supports internal notes, a quoted total, and status updates only. It does not send email, text messages, invoices, or payment requests.

## Planned customer email

When transactional email is added, a successful order creation should send the order reference, the original secure View Order Status link, event date, selected dishes, and a clear note that availability and pricing are pending. Status-change messages may follow later. Invoices and Zelle/Venmo instructions belong to a separate payments phase.
