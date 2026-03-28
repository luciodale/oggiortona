const ITALIAN_PHONE_REGEX = /^\+?39?\s?\d{3}\s?\d{6,7}$/;

export function isValidItalianPhone(phone: string) {
  const cleaned = phone.replace(/[\s\-()]/g, "");
  return ITALIAN_PHONE_REGEX.test(cleaned);
}

export function cleanPhone(phone: string) {
  return phone.replace(/[\s\-()]/g, "");
}

export function isNonEmpty(value: string) {
  return value.trim().length > 0;
}

export function isWithinLength(value: string, max: number) {
  return value.trim().length <= max;
}
