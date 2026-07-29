import * as z from "zod";

const phoneMessage = "Enter a valid phone number with at least 10 digits.";
const validPhone = (value: string) => /^\+?[\d().\s-]+$/.test(value) && value.replace(/\D/g, "").length >= 10 && value.replace(/\D/g, "").length <= 15;

export const quoteFormSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name."),
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  phone: z.string().trim().refine(validPhone, phoneMessage),
  eventDate: z.string().min(1, "Please select an event date."),
  eventType: z.string().trim().min(1, "Please select an event type."),
  venue: z.string().trim().min(2, "Enter a venue or city."),
  dietaryNeeds: z.string().optional(),
  website: z.string().optional(),
});

export type FormValues = z.infer<typeof quoteFormSchema>;
export const quoteFieldOrder = ["fullName", "email", "phone", "eventDate", "eventType", "venue"] as const;
export type QuoteFieldName = (typeof quoteFieldOrder)[number];

export function firstInvalidQuoteField(errors: Partial<Record<QuoteFieldName, unknown>>) {
  return quoteFieldOrder.find((field) => Boolean(errors[field]));
}

export function navigateToFirstInvalidQuoteField(
  errors: Partial<Record<QuoteFieldName, unknown>>,
  focus: (field: QuoteFieldName) => void,
  reducedMotion: boolean,
  documentLike: Pick<Document, "getElementById"> = document,
) {
  const field = firstInvalidQuoteField(errors);
  if (!field) return undefined;
  documentLike.getElementById(field)?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center" });
  focus(field);
  return field;
}
