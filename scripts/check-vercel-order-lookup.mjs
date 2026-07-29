import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const file = resolve(process.cwd(), "api/orders/lookup.ts");
if (!existsSync(file)) throw new Error("Missing Vercel order-lookup function entrypoint.");
const source = readFileSync(file, "utf8");
if (!source.includes('"../../server/app.js"') || !source.includes("createApp")) throw new Error("Order lookup must delegate to the shared Express app with an ESM .js import.");
console.log("Vercel order-lookup entrypoint is present and delegates to the shared Express app.");
