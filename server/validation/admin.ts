import { z } from "zod";
import type { AdminStatusGroup } from "../../src/shared/admin.js";
import { AppError } from "../errors.js";

const trimmedOptional = (max: number) => z.string().trim().max(max).optional().transform((value) => value || undefined);

export const adminLoginSchema = z.object({ username: z.string().trim().min(1).max(120), password: z.string().min(1).max(1024) }).strict();
export const adminStatusSchema = z.object({ status: z.enum(["received", "reviewing", "confirmed", "preparing", "ready", "completed", "cancelled"]) }).strict();
export const adminNotesSchema = z.object({ adminNotes: trimmedOptional(5000) }).strict();
export const adminPriceSchema = z.object({ quotedTotalCents: z.number().int().min(0).max(10_000_000).nullable() }).strict();

export function parseAdminListQuery(query: Record<string, unknown>) {
  const result = z.object({ group: z.enum(["new", "upcoming", "finished"]).optional(), search: z.string().trim().max(120).optional(), page: z.coerce.number().int().min(1).max(10_000).optional(), limit: z.coerce.number().int().min(1).max(50).optional() }).safeParse(query);
  if (!result.success) throw new AppError(400, "VALIDATION_ERROR", "Please check the order list options.");
  return result.data as { group?: AdminStatusGroup; search?: string; page?: number; limit?: number };
}

export function parseAdminBody<T>(schema: z.ZodType<T>, body: unknown): T {
  const result = schema.safeParse(body);
  if (!result.success) throw new AppError(400, "VALIDATION_ERROR", "Please check the information and try again.");
  return result.data;
}
