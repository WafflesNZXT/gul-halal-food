import path from "node:path";
import express from "express";
import helmet from "helmet";
import { createOrdersRouter } from "./routes/orders";
import { errorHandler, notFoundApi } from "./middleware/errors";
import type { OrderRepository } from "./repositories/orders";

export function createApp(repository?: OrderRepository) {
  const app = express();
  app.disable("x-powered-by");
  app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
  app.use(express.json({ limit: "100kb", strict: true }));
  app.use("/api", createOrdersRouter(repository));
  app.use("/api", notFoundApi);

  if (process.env.NODE_ENV === "production") {
    const dist = path.resolve(process.cwd(), "dist");
    app.use(express.static(dist));
    app.get(/^(?!\/api\/).*/, (_req: any, res: any) => res.sendFile(path.join(dist, "index.html")));
  }

  app.use(errorHandler);
  return app;
}
