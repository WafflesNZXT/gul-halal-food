import path from "node:path";
import { config as loadDotenv } from "dotenv";

// Load server-only variables from the repository root. Vite has its own loadEnv
// call and only exposes variables explicitly prefixed with VITE_ to the browser.
loadDotenv({ path: path.resolve(process.cwd(), ".env"), quiet: true });

type Environment = NodeJS.ProcessEnv;

function firstDefined(environment: Environment, names: readonly string[]) {
  for (const name of names) {
    const value = environment[name]?.trim();
    if (value) return value;
  }
  return undefined;
}

function asPort(value: string | undefined) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 && parsed < 65536 ? parsed : undefined;
}

export function getApiPort() {
  const configuredPort = asPort(process.env.API_PORT);
  if (configuredPort) return configuredPort;

  const appPort = asPort(process.env.PORT);
  if (process.env.NODE_ENV === "production") return appPort ?? 5000;

  // Replit Preview commonly reserves PORT=5000 for Vite. Keep the API beside it.
  if (appPort === 5000) return 5001;
  return 5000;
}

/**
 * The pooled URL is the right default for request-serving code, including
 * Vercel Functions. It intentionally never reaches Vite's client config.
 */
export function getRuntimeDatabaseUrl(environment: Environment = process.env) {
  return firstDefined(environment, ["DATABASE_URL", "POSTGRES_URL"]);
}

/**
 * Migrations prefer a direct/unpooled URL when one is provided. This prevents
 * schema work from consuming the constrained runtime pool on hosted Neon.
 */
export function getMigrationDatabaseUrl(environment: Environment = process.env) {
  return firstDefined(environment, [
    "DATABASE_MIGRATION_URL",
    "DATABASE_URL_UNPOOLED",
    "POSTGRES_URL_NON_POOLING",
    "POSTGRES_URL_NO_SSL",
    "DATABASE_URL",
    "POSTGRES_URL",
  ]);
}

function asHttpOrigin(value: string | undefined) {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.origin : undefined;
  } catch {
    return undefined;
  }
}

function vercelOrigin(environment: Environment) {
  const host = firstDefined(environment, ["VERCEL_PROJECT_PRODUCTION_URL", "VERCEL_BRANCH_URL", "VERCEL_URL"]);
  if (!host) return undefined;
  return asHttpOrigin(host.startsWith("http") ? host : `https://${host}`);
}

type OriginRequest = { get(name: string): string | undefined };

/**
 * Uses an explicit public URL first. On Vercel, a current request host keeps
 * links on a custom or preview domain; VERCEL_URL is the safe fallback.
 */
export function getPublicBaseUrl(request?: OriginRequest, environment: Environment = process.env) {
  const requestOrigin = asHttpOrigin(request?.get("origin"));
  // The order route accepts browser origins only after requireTrustedOrigin.
  // This must win over APP_BASE_URL so a Preview/local confirmation always
  // gets a status link on the page the customer is actually viewing.
  if (requestOrigin) return requestOrigin;

  const configured = asHttpOrigin(environment.APP_BASE_URL);
  if (configured) return configured;

  const requestHost = request?.get("x-forwarded-host") ?? request?.get("host");
  const forwardedProtocol = request?.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const requestProtocol = forwardedProtocol === "http" ? "http" : "https";
  const requestBase = requestHost ? asHttpOrigin(`${requestProtocol}://${requestHost}`) : undefined;

  if (environment.VERCEL && requestBase) return requestBase;
  return vercelOrigin(environment) ?? requestOrigin ?? requestBase;
}
