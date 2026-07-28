import { access, readFile } from "node:fs/promises";
import path from "node:path";

const entrypoint = path.join("api", "orders", "status", "[token].ts");
const expectedImport = "../../../server/app.js";

try {
  const source = await readFile(entrypoint, "utf8");
  if (!source.includes(`from \"${expectedImport}\"`) || !source.includes("export default createApp()")) {
    throw new Error("The status-route function must delegate to the existing Express app.");
  }
  await access("vercel.json");
  console.log("Vercel status-route entrypoint is present and delegates to the shared Express app.");
} catch (error) {
  console.error(error instanceof Error ? error.message : "Vercel status-route check failed.");
  process.exitCode = 1;
}
