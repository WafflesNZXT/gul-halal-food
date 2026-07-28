import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import { serviceUnavailable } from "./errors";

let pool: Pool | undefined;

export function getDatabase() {
  if (!process.env.DATABASE_URL) throw serviceUnavailable();
  pool ??= new Pool({ connectionString: process.env.DATABASE_URL, max: 5 });
  return drizzle(pool, { schema });
}

export async function closeDatabase() {
  await pool?.end();
  pool = undefined;
}
