import { migrate } from "drizzle-orm/node-postgres/migrator";
import { getMigrationDatabase, closeDatabase } from "./db.js";

async function run() {
  try {
    await migrate(getMigrationDatabase(), { migrationsFolder: "drizzle" });
  } finally {
    await closeDatabase();
  }
}

run().catch(() => {
  process.exitCode = 1;
});
