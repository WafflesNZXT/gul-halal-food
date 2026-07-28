import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const asPort = (value: string | undefined) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 && parsed < 65536 ? parsed : undefined;
};

export default defineConfig(({ mode }) => {
  // Vite does not place non-VITE_ values in the client bundle. This is only
  // configuration-time loading so DATABASE_URL remains server-only.
  const env = loadEnv(mode, rootDir, "");
  const port = asPort(process.env.PORT ?? env.PORT) ?? 5173;
  const apiPort = asPort(process.env.API_PORT ?? env.API_PORT) ?? (port === 5000 ? 5001 : 5000);
  const replitHosts: string[] = [];
  const replitDevDomain = process.env.REPLIT_DEV_DOMAIN ?? env.REPLIT_DEV_DOMAIN;
  const replitDomains = process.env.REPLIT_DOMAINS ?? env.REPLIT_DOMAINS;
  if (replitDevDomain) replitHosts.push(replitDevDomain);
  if (replitDomains) replitHosts.push(...replitDomains.split(",").map((host) => host.trim()).filter(Boolean));
  const allowedHosts = ["localhost", "127.0.0.1", ...replitHosts];

  return {
  base: process.env.BASE_PATH ?? env.BASE_PATH ?? "/",

  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      "@": path.resolve(rootDir, "src"),
      "@assets": path.resolve(rootDir, "src/assets"),
    },
    dedupe: ["react", "react-dom"],
  },

  build: {
    outDir: path.resolve(rootDir, "dist"),
    emptyOutDir: true,
  },

  server: {
    port,
    host: "0.0.0.0",
    allowedHosts,
    proxy: {
      "/api": {
        target: `http://127.0.0.1:${apiPort}`,
        changeOrigin: false,
      },
    },
  },

  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts,
  },
  };
});
