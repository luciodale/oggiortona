export function isToday(dateStart: string, dateEnd: string | null) {
  const today = getTodayISO();
  if (dateStart === today) return true;
  if (dateEnd && dateStart <= today && dateEnd >= today) return true;
  return false;
}

export function isThisWeek(dateStr: string) {
  const today = getTodayISO();
  const d = new Date(today + "T00:00:00Z");
  const dow = d.getUTCDay();
  const mondayOffset = dow === 0 ? 6 : dow - 1;

  const monday = new Date(d);
  monday.setUTCDate(d.getUTCDate() - mondayOffset);
  const mondayISO = monday.toISOString().substring(0, 10);

  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);
  const sundayISO = sunday.toISOString().substring(0, 10);

  return dateStr >= mondayISO && dateStr <= sundayISO;
}

export function isUpcoming(dateStr: string) {
  return dateStr >= getTodayISO();
}

import type { Locale } from "../types/domain";
import { t } from "../i18n/t";

const LOCALE_MAP: Record<Locale, string> = { it: "it-IT", en: "en-GB" };

export function formatDateLong(dateStr: string, locale: Locale) {
  const date = new Date(dateStr + "T00:00:00Z");
  return date.toLocaleDateString(LOCALE_MAP[locale], {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "Europe/Rome",
  });
}

export function formatDateShort(dateStr: string, locale: Locale) {
  const date = new Date(dateStr + "T00:00:00Z");
  return date.toLocaleDateString(LOCALE_MAP[locale], {
    day: "numeric",
    month: "short",
    timeZone: "Europe/Rome",
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
  return formatDateShort(dateStr.substring(0, 10), locale);
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
