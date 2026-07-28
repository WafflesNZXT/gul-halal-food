import { defineConfig } from "drizzle-kit";
import { getMigrationDatabaseUrl } from "./server/env";

export default defineConfig({
  schema: "./server/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: getMigrationDatabaseUrl() ?? "postgresql://database-url-required-for-migrations",
  },
});
