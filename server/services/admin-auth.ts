import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
const KEY_LENGTH = 64;
const DEFAULT_TTL_HOURS = 12;

export const ADMIN_COOKIE_NAME = "gul_admin_session";

function derivePasswordHash(password: string, salt: Buffer, n: number, r: number, p: number) {
  return new Promise<Buffer>((resolve, reject) => {
    scryptCallback(password, salt, KEY_LENGTH, { N: n, r, p, maxmem: 64 * 1024 * 1024 }, (error, derived) => {
      if (error) reject(error); else resolve(derived as Buffer);
    });
  });
}

export function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function createSessionToken() {
  return randomBytes(32).toString("base64url");
}

export function getAdminSessionTtlHours(environment: NodeJS.ProcessEnv = process.env) {
  const value = Number(environment.ADMIN_SESSION_TTL_HOURS);
  return Number.isFinite(value) && value >= 1 && value <= 168 ? Math.floor(value) : DEFAULT_TTL_HOURS;
}

export async function hashAdminPassword(password: string) {
  if (password.length < 12) throw new Error("Password must be at least 12 characters.");
  const salt = randomBytes(16);
  const derived = await derivePasswordHash(password, salt, 16384, 8, 1);
  return `scrypt-v1$16384$8$1$${salt.toString("base64url")}$${derived.toString("base64url")}`;
}

export async function verifyAdminPassword(password: string, storedHash: string | undefined) {
  if (!storedHash) return false;
  const parts = storedHash.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt-v1") return false;
  const [,, rValue, pValue, saltValue, digestValue] = parts;
  const n = Number(parts[1]);
  const r = Number(rValue);
  const p = Number(pValue);
  if (n !== 16384 || r !== 8 || p !== 1) return false;
  try {
    const salt = Buffer.from(saltValue, "base64url");
    const expected = Buffer.from(digestValue, "base64url");
    if (expected.length !== KEY_LENGTH || salt.length < 16) return false;
    const actual = await derivePasswordHash(password, salt, n, r, p);
    return timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

export function parseCookies(header: string | undefined) {
  const result: Record<string, string> = {};
  for (const part of header?.split(";") ?? []) {
    const separator = part.indexOf("=");
    if (separator < 1) continue;
    result[part.slice(0, separator).trim()] = decodeURIComponent(part.slice(separator + 1).trim());
  }
  return result;
}

export function adminCookieOptions(expiresAt: Date) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" || Boolean(process.env.VERCEL),
    sameSite: "lax" as const,
    path: "/",
    expires: expiresAt,
  };
}
