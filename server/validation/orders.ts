import { z } from "zod";
import type { CreateOrderRequest } from "../../src/shared/orders.js";
import { AppError } from "../errors.js";

const trimmed = (max: number) => z.string().trim().min(1).max(max);
const optionalTrimmed = (max: number) => z.string().trim().max(max).optional().transform((value) => value || undefined);

const itemSchema = z.object({
  menuItemId: z.string().trim().min(1).max(80),
  proteinChoice: z.string().trim().min(1).max(40).optional(),
  spiceLevel: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  extras: z.record(z.string().max(60), z.string().trim().max(80)).optional(),
  peopleCount: z.number().int().min(1).max(10000),
}).strict();

export const createOrderSchema = z.object({
  customerName: trimmed(120),
  customerEmail: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  customerPhone: z.string().trim().min(7).max(40).regex(/^[0-9+()\-\s.]+$/, "Enter a valid phone number."),
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => !Number.isNaN(Date.parse(`${value}T00:00:00Z`)), "Enter a valid event date."),
  eventType: z.enum(["wedding", "family", "community", "corporate", "birthday", "other"]),
  venue: trimmed(180),
  customerNotes: optionalTrimmed(3000),
  dietaryNeeds: optionalTrimmed(1500),
  items: z.array(itemSchema).min(1, "Add at least one dish.").max(30),
  website: z.string().max(200).optional(),
}).strict();

export function parseCreateOrder(body: unknown): CreateOrderRequest {
  const result = createOrderSchema.safeParse(body);
  if (!result.success) {
    throw new AppError(400, "VALIDATION_ERROR", "Please correct the highlighted order details.", result.error.issues.map((issue) => ({ path: issue.path.join("."), message: issue.message })));
  }
  if (result.data.website?.trim()) {
    throw new AppError(400, "VALIDATION_ERROR", "Please correct the highlighted order details.");
  }
  return result.data;
}
