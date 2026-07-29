import { Router } from "express";
import { createHash, timingSafeEqual } from "node:crypto";
import { AppError } from "../errors.js";
import { requireAdminSession } from "../middleware/admin-auth.js";
import { adminLoginRateLimit, requireJsonContent, requireTrustedOrigin } from "../middleware/security.js";
import { PostgresAdminRepository, type AdminRepository } from "../repositories/admin.js";
import { adminCookieOptions, ADMIN_COOKIE_NAME, createSessionToken, getAdminSessionTtlHours, hashSessionToken, parseCookies, verifyAdminPassword } from "../services/admin-auth.js";
import { adminLoginSchema, adminNotesSchema, adminPriceSchema, adminStatusSchema, parseAdminBody, parseAdminListQuery } from "../validation/admin.js";

const invalidCredentials = () => new AppError(401, "INVALID_CREDENTIALS", "The username or password is not correct.");
const failedLoginDelay = () => new Promise((resolve) => setTimeout(resolve, 350));
const usernameDigest = (value: string) => createHash("sha256").update(value).digest();

export function createAdminRouter(repository: AdminRepository = new PostgresAdminRepository(), environment: NodeJS.ProcessEnv = process.env) {
  const router = Router();
  router.post("/admin/login", adminLoginRateLimit, requireTrustedOrigin, requireJsonContent, async (req: any, res: any, next: any) => {
    try {
      const { username, password } = parseAdminBody(adminLoginSchema, req.body);
      const configuredUsername = environment.ADMIN_USERNAME ?? "";
      const usernameMatches = Boolean(configuredUsername) && timingSafeEqual(usernameDigest(username), usernameDigest(configuredUsername));
      const passwordMatches = await verifyAdminPassword(password, environment.ADMIN_PASSWORD_HASH);
      if (!usernameMatches || !passwordMatches) { await failedLoginDelay(); throw invalidCredentials(); }
      const rawToken = createSessionToken();
      const expiresAt = new Date(Date.now() + getAdminSessionTtlHours(environment) * 60 * 60 * 1000);
      await repository.createSession(hashSessionToken(rawToken), expiresAt);
      res.cookie(ADMIN_COOKIE_NAME, rawToken, adminCookieOptions(expiresAt));
      return res.json({ authenticated: true, expiresAt: expiresAt.toISOString() });
    } catch (error) { return next(error); }
  });

  router.use("/admin", requireAdminSession(repository));
  router.get("/admin/session", (req: any, res: any) => res.json({ authenticated: true, expiresAt: req.adminSession.expiresAt.toISOString() }));
  router.post("/admin/logout", requireTrustedOrigin, requireJsonContent, async (req: any, res: any, next: any) => {
    try {
      const token = parseCookies(req.get("cookie"))[ADMIN_COOKIE_NAME];
      if (token) await repository.revokeSession(hashSessionToken(token));
      res.clearCookie(ADMIN_COOKIE_NAME, { httpOnly: true, secure: process.env.NODE_ENV === "production" || Boolean(process.env.VERCEL), sameSite: "lax", path: "/" });
      return res.status(204).end();
    } catch (error) { return next(error); }
  });
  router.get("/admin/orders", async (req: any, res: any, next: any) => { try { return res.json(await repository.listOrders(parseAdminListQuery(req.query))); } catch (error) { return next(error); } });
  router.get("/admin/orders/:reference", async (req: any, res: any, next: any) => { try { const order = await repository.findOrder(req.params.reference); if (!order) throw new AppError(404, "NOT_FOUND", "Order not found."); return res.json(order); } catch (error) { return next(error); } });
  router.patch("/admin/orders/:reference/status", requireTrustedOrigin, requireJsonContent, async (req: any, res: any, next: any) => { try { const { status } = parseAdminBody(adminStatusSchema, req.body); const order = await repository.updateStatus(req.params.reference, status); if (!order) throw new AppError(404, "NOT_FOUND", "Order not found."); return res.json(order); } catch (error) { return next(error); } });
  router.patch("/admin/orders/:reference/notes", requireTrustedOrigin, requireJsonContent, async (req: any, res: any, next: any) => { try { const { adminNotes } = parseAdminBody(adminNotesSchema, req.body); const order = await repository.updateNotes(req.params.reference, adminNotes); if (!order) throw new AppError(404, "NOT_FOUND", "Order not found."); return res.json(order); } catch (error) { return next(error); } });
  router.patch("/admin/orders/:reference/price", requireTrustedOrigin, requireJsonContent, async (req: any, res: any, next: any) => { try { const { quotedTotalCents } = parseAdminBody(adminPriceSchema, req.body); const order = await repository.updatePrice(req.params.reference, quotedTotalCents ?? undefined); if (!order) throw new AppError(404, "NOT_FOUND", "Order not found."); return res.json(order); } catch (error) { return next(error); } });
  return router;
}
