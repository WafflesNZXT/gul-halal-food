import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT) || 5173;

const replitHosts: string[] = [];
if (process.env.REPLIT_DEV_DOMAIN) {
  replitHosts.push(process.env.REPLIT_DEV_DOMAIN);
}
if (process.env.REPLIT_DOMAINS) {
  replitHosts.push(...process.env.REPLIT_DOMAINS.split(",").map((h) => h.trim()).filter(Boolean));
}
const allowedHosts = ["localhost", "127.0.0.1", ...replitHosts];

export default defineConfig({
  base: process.env.BASE_PATH || "/",

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
  },

  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts,
  },
});