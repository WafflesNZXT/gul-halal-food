import { normalizePhoneForAction, safeAdminEmail } from "@/lib/admin-contact";

export function AdminCustomerContact({ phone, email, reference }: { phone?: string; email?: string; reference: string }) {
  const actionPhone = normalizePhoneForAction(phone);
  const actionEmail = safeAdminEmail(email);
  const buttonClass = "flex min-h-12 items-center justify-center rounded-xl bg-primary px-4 text-lg font-bold text-white focus-visible:outline focus-visible:outline-4 focus-visible:outline-secondary";
  const disabledClass = "flex min-h-12 items-center justify-center rounded-xl bg-muted px-4 text-lg font-bold text-muted-foreground";
  return <><dl className="mt-5 space-y-4"><div><dt className="text-base font-semibold text-foreground/60">Phone Number</dt><dd className="mt-1 break-words text-xl font-bold text-foreground select-text">{phone || "Not provided"}</dd></div><div><dt className="text-base font-semibold text-foreground/60">Email Address</dt><dd className="mt-1 break-all text-xl font-bold text-foreground select-text">{email || "Not provided"}</dd></div></dl><div className="mt-6 grid gap-3 sm:grid-cols-3">{actionPhone ? <a href={`tel:${actionPhone}`} className={buttonClass}>Call Customer</a> : <span className={disabledClass} aria-disabled="true">Call unavailable</span>}{actionPhone ? <a href={`sms:${actionPhone}`} className={buttonClass}>Text Customer</a> : <span className={disabledClass} aria-disabled="true">Text unavailable</span>}{actionEmail ? <a href={`mailto:${actionEmail}?subject=${encodeURIComponent(`Gul Halal Food Order ${reference}`)}`} className={buttonClass}>Email Customer</a> : <span className={disabledClass} aria-disabled="true">Email unavailable</span>}</div></>;
}
