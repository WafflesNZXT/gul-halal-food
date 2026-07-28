import { migrate } from "drizzle-orm/node-postgres/migrator";
import { getDatabase, closeDatabase } from "./db";

async function run() {
  try {
    await migrate(getDatabase(), { migrationsFolder: "drizzle" });
  } finally {
    await closeDatabase();
  }
}

run().catch(() => {
  process.exitCode = 1;
});
