import { z } from "zod";
import { AppError } from "../errors.js";

const lookupSchema = z.object({
  reference: z.string().trim().toUpperCase().regex(/^GHF-\d{4}-[A-Z0-9]{6}$/),
  contact: z.string().trim().min(3).max(254),
}).strict();

export type LookupRequest = { reference: string; contact: string };

export function parseOrderLookup(body: unknown): LookupRequest {
  const result = lookupSchema.safeParse(body);
  if (!result.success) throw new AppError(400, "VALIDATION_ERROR", "We could not find an order matching those details.");
  return result.data;
}
