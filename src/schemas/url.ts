import { z } from "zod";

const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);

export function isSafeUrl(value: string): boolean {
  if (!value) return false;
  try {
    const url = new URL(value);
    return ALLOWED_PROTOCOLS.has(url.protocol);
  } catch {
    return false;
  }
}

export function safeUrlSchema(message: string) {
  return z.string().trim().refine(isSafeUrl, message);
}

export function optionalSafeUrlSchema(message: string) {
  return z
    .union([z.string().trim().length(0), z.string().trim().refine(isSafeUrl, message)])
    .transform((v) => (v.length === 0 ? "" : v));
}
