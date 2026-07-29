export function normalizePhoneForAction(value?: string) {
  const trimmed = value?.trim() ?? "";
  if (!trimmed || /[a-z]/i.test(trimmed)) return null;
  const plus = trimmed.startsWith("+") ? "+" : "";
  const digits = trimmed.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15 ? `${plus}${digits}` : null;
}

export function safeAdminEmail(value?: string) {
  const email = value?.trim() ?? "";
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
}
