import { AppError } from "../errors.js";
import type { AdminRepository } from "../repositories/admin.js";
import { ADMIN_COOKIE_NAME, hashSessionToken, parseCookies } from "../services/admin-auth.js";

export function requireAdminSession(repository: AdminRepository) {
  return async (req: any, _res: any, next: any) => {
    try {
      const token = parseCookies(req.get("cookie"))[ADMIN_COOKIE_NAME];
      if (!token || !/^[A-Za-z0-9_-]{43,128}$/.test(token)) throw new AppError(401, "UNAUTHENTICATED", "Please sign in to continue.");
      const session = await repository.findSession(hashSessionToken(token));
      if (!session) throw new AppError(401, "UNAUTHENTICATED", "Please sign in to continue.");
      req.adminSession = session;
      if (Date.now() - session.lastSeenAt.getTime() > 15 * 60 * 1000) void repository.touchSession(session.tokenHash, new Date());
      return next();
    } catch (error) { return next(error); }
  };
}
