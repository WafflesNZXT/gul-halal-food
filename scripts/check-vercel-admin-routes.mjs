import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const routes = [
  "api/admin/login.ts", "api/admin/logout.ts", "api/admin/session.ts", "api/admin/orders/index.ts",
  "api/admin/orders/[reference].ts", "api/admin/orders/[reference]/status.ts",
  "api/admin/orders/[reference]/notes.ts", "api/admin/orders/[reference]/price.ts",
];
for (const route of routes) {
  const file = resolve(process.cwd(), route);
  if (!existsSync(file)) throw new Error(`Missing Vercel admin function entrypoint: ${route}`);
  if (!readFileSync(file, "utf8").includes("createApp")) throw new Error(`Admin function does not reuse Express: ${route}`);
}
console.log(`Verified ${routes.length} explicit Vercel admin function entrypoints.`);
