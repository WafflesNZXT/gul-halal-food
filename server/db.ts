import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema.js";
import { serviceUnavailable } from "./errors.js";
import { getMigrationDatabaseUrl, getRuntimeDatabaseUrl } from "./env.js";

let runtimePool: Pool | undefined;
let migrationPool: Pool | undefined;

function databaseFor(connectionString: string, poolType: "runtime" | "migration") {
  const pool = poolType === "runtime"
    ? (runtimePool ??= new Pool({ connectionString, max: 5 }))
    : (migrationPool ??= new Pool({ connectionString, max: 2 }));
  return drizzle(pool, { schema });
}

export function getDatabase() {
  const connectionString = getRuntimeDatabaseUrl();
  if (!connectionString) throw serviceUnavailable();
  return databaseFor(connectionString, "runtime");
}

export function getMigrationDatabase() {
  const connectionString = getMigrationDatabaseUrl();
  if (!connectionString) throw serviceUnavailable();
  return databaseFor(connectionString, "migration");
}

export async function closeDatabase() {
  await Promise.all([runtimePool?.end(), migrationPool?.end()]);
  runtimePool = undefined;
  migrationPool = undefined;
}
