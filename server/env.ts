import path from "node:path";
import { config as loadDotenv } from "dotenv";

// Load server-only variables from the repository root. Vite has its own loadEnv
// call and only exposes variables explicitly prefixed with VITE_ to the browser.
loadDotenv({ path: path.resolve(process.cwd(), ".env"), quiet: true });

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
