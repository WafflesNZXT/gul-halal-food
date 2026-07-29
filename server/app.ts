import path from "node:path";
import express from "express";
import helmet from "helmet";
import { createOrdersRouter } from "./routes/orders.js";
import { createAdminRouter } from "./routes/admin.js";
import { errorHandler, notFoundApi } from "./middleware/errors.js";
import { configureProxyTrust } from "./middleware/security.js";
import type { OrderRepository } from "./repositories/orders.js";
import type { AdminRepository } from "./repositories/admin.js";

export function createApp(repository?: OrderRepository, adminRepository?: AdminRepository, environment: NodeJS.ProcessEnv = process.env) {
  const app = express();
  configureProxyTrust(app);
  app.disable("x-powered-by");
  app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
  app.use(express.json({ limit: "100kb", strict: true }));
  app.get("/api/health", (_req: any, res: any) => res.json({ status: "ok" }));
  app.use("/api", createOrdersRouter(repository));
  app.use("/api", createAdminRouter(adminRepository, environment));
  app.use("/api", notFoundApi);

  // Vercel serves Vite's static output directly. Keep this only for the
  // standalone Node production server used outside Vercel.
  if (process.env.NODE_ENV === "production" && !process.env.VERCEL) {
    const dist = path.resolve(process.cwd(), "dist");
    app.use(express.static(dist));
    app.get(/^(?!\/api\/).*/, (_req: any, res: any) => res.sendFile(path.join(dist, "index.html")));
  }

  app.use(errorHandler);
  return app;
}
