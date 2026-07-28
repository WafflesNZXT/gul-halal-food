# Vercel and Neon deployment

This project deploys the Vite build as static output and exposes the existing
Express application through the `api/[...path].ts` Vercel Function. Static files
are served by Vercel, not by Express. The SPA rewrite in `vercel.json` keeps
deep links such as `/menu/chicken-biryani`, `/quote`, and
`/order-status/:token` working; Vercel Functions take precedence for `/api/*`.

## Local development

1. Copy `.env.example` to `.env` and set `DATABASE_URL` to a Neon pooled URL.
2. Run `npm run dev`.

Vite runs on `http://localhost:5173`; Express runs on `API_PORT` (default
`5000`), and Vite proxies `/api` to that port. `npm run start` remains the
standalone production-style Node server and serves both the API and `dist`.

## Database variables

Runtime requests resolve their connection string in this order:

1. `DATABASE_URL`
2. `POSTGRES_URL`

Migrations resolve a direct connection in this order:

1. `DATABASE_MIGRATION_URL`
2. `DATABASE_URL_UNPOOLED`
3. `POSTGRES_URL_NON_POOLING`
4. `POSTGRES_URL_NO_SSL`
5. `DATABASE_URL`
6. `POSTGRES_URL`

All of these are server-only variables. Do not use a `VITE_` prefix.

## Migrations

Migrations never run during a Vercel build or function invocation. Apply them
deliberately against the intended database before or alongside a release:

```powershell
$env:DATABASE_MIGRATION_URL = "<direct Neon URL>"
npm run db:migrate
```

For a production release, set the required server-side variables for the
Vercel Production environment, apply the migration once, then deploy. Repeat
with a separate Neon database or branch for Preview deployments.

## Vercel environments and deploys

Configure `DATABASE_URL` (or `POSTGRES_URL`) for each Vercel environment. Set
`DATABASE_MIGRATION_URL` or an unpooled fallback only where migrations run.
`APP_BASE_URL` is optional: when omitted, the API uses the request's deployment
origin, then Vercel's server-side deployment URL, for customer status links.

After linking the project, a preview build can be checked with:

```powershell
vercel pull --yes --environment=preview
vercel build
```

Deploy preview and production only after the configured database has the
migration applied:

```powershell
vercel deploy
vercel deploy --prod
```

Use `vercel curl /api/health --deployment <preview-url>` to check a protected
preview without weakening deployment protection.
