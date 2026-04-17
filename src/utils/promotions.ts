import { getTodayISO } from "./date";

export const PROMOTION_DURATION_DAYS = 7;

export function computeDateEnd(dateStart: string, durationDays: number): string {
  const start = new Date(dateStart + "T00:00:00Z");
  start.setUTCDate(start.getUTCDate() + durationDays - 1);
  return start.toISOString().substring(0, 10);
}

export function isPromotionActive(dateStart: string, dateEnd: string, today?: string): boolean {
  const t = today ?? getTodayISO();
  return dateStart <= t && dateEnd >= t;
}

export function daysRemaining(dateEnd: string, today?: string): number {
  const t = today ?? getTodayISO();
  const expires = new Date(dateEnd + "T00:00:00Z");
  const now = new Date(t + "T00:00:00Z");
  const diff = Math.floor((expires.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff + 1);
}
