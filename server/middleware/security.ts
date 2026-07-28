import rateLimit from "express-rate-limit";

type ProxyConfigurableApp = { set(name: "trust proxy", value: number): unknown };

/**
 * Vercel places Functions behind one trusted edge proxy. Restrict trust to
 * that single hop only in Vercel so direct/local requests cannot spoof a
 * client IP through X-Forwarded-For.
 */
export function configureProxyTrust(app: ProxyConfigurableApp, environment: NodeJS.ProcessEnv = process.env) {
  if (environment.VERCEL) app.set("trust proxy", 1);
}

function configuredOrigins() {
  const values = [process.env.APP_BASE_URL, process.env.REPLIT_DEV_DOMAIN && `https://${process.env.REPLIT_DEV_DOMAIN}`];
  if (process.env.REPLIT_DOMAINS) {
    values.push(...process.env.REPLIT_DOMAINS.split(",").map((domain) => `https://${domain.trim()}`));
  }
  return values.filter((value): value is string => Boolean(value));
}

export function requireTrustedOrigin(req: any, res: any, next: any) {
  const origin = req.get("origin");
  if (!origin) return next();
  const sameHost = (() => {
    try { return new URL(origin).host === req.get("host"); } catch { return false; }
  })();
  if (sameHost || configuredOrigins().includes(origin)) return next();
  return res.status(403).json({ error: { code: "FORBIDDEN", message: "This request was not accepted." } });
}

export const orderRateLimit = rateLimit({
  windowMs: Number(process.env.ORDER_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  limit: Number(process.env.ORDER_RATE_LIMIT_MAX) || 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: { code: "RATE_LIMITED", message: "Too many order requests. Please try again later." } },
});
