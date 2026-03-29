export function isToday(dateStart: string, dateEnd: string | null) {
  const today = getTodayISO();
  if (dateStart === today) return true;
  if (dateEnd && dateStart <= today && dateEnd >= today) return true;
  return false;
}

export function isThisWeek(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Monday
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);

  return date >= startOfWeek && date < endOfWeek;
}

export function isUpcoming(dateStr: string) {
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
}

import type { Locale } from "../types/domain";
import { t } from "../i18n/t";

const LOCALE_MAP: Record<Locale, string> = { it: "it-IT", en: "en-GB" };

export function formatDateLong(dateStr: string, locale: Locale) {
  const date = new Date(dateStr);
  return date.toLocaleDateString(LOCALE_MAP[locale], {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function formatDateShort(dateStr: string, locale: Locale) {
  const date = new Date(dateStr);
  return date.toLocaleDateString(LOCALE_MAP[locale], {
    day: "numeric",
    month: "short",
  });
}

export function relativeTime(dateStr: string, locale: Locale) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return t("date.now", locale);
  if (diffMinutes < 60) return t("date.minutesAgo", locale, { count: diffMinutes });
  if (diffHours < 24) return t("date.hoursAgo", locale, { count: diffHours });
  if (diffDays < 7) return t("date.daysAgo", locale, { count: diffDays });
  return formatDateShort(dateStr, locale);
}

export function getTodayISO() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Rome",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "00";
  return `${get("year")}-${get("month")}-${get("day")}`;
}
