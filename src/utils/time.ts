import type { DaySchedule, ItalianDay, OpeningHours } from "../types/database";
import type { Locale } from "../types/domain";
import { DAY_LABELS } from "../i18n/t";

const DAY_MAP: Array<ItalianDay> = [
  "domenica",
  "lunedi",
  "martedi",
  "mercoledi",
  "giovedi",
  "venerdi",
  "sabato",
];

export function getItalianDayName(date: Date): ItalianDay {
  const dayIndex = date.getDay();
  const day = DAY_MAP[dayIndex];
  if (!day) throw new Error(`Invalid day index: ${dayIndex}`);
  return day;
}

export function getDayLabel(day: ItalianDay, locale: Locale) {
  return DAY_LABELS[locale][day];
}

export function getOrderedDays(): Array<ItalianDay> {
  return [
    "lunedi",
    "martedi",
    "mercoledi",
    "giovedi",
    "venerdi",
    "sabato",
    "domenica",
  ];
}

function timeToMinutes(time: string) {
  const parts = time.split(":");
  const hours = parseInt(parts[0] ?? "0", 10);
  const minutes = parseInt(parts[1] ?? "0", 10);
  return hours * 60 + minutes;
}

function isWithinShift(
  currentMinutes: number,
  open: string,
  close: string,
) {
  const openMinutes = timeToMinutes(open);
  const closeMinutes = timeToMinutes(close);

  if (closeMinutes < openMinutes) {
    // Crosses midnight
    return currentMinutes >= openMinutes || currentMinutes < closeMinutes;
  }
  return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
}

export function isOpenNow(hours: OpeningHours, now?: Date) {
  const current = now ?? getNowInItaly();
  const day = getItalianDayName(current);
  const schedule = hours[day];

  if (!schedule) return false;

  const currentMinutes =
    current.getHours() * 60 + current.getMinutes();

  if (isWithinShift(currentMinutes, schedule.open, schedule.close)) {
    return true;
  }

  if (schedule.open2 && schedule.close2) {
    return isWithinShift(currentMinutes, schedule.open2, schedule.close2);
  }

  return false;
}

export function formatTime(time: string) {
  return time;
}

export function formatSchedule(schedule: DaySchedule | null, locale: Locale) {
  if (!schedule) return locale === "it" ? "Chiuso" : "Closed";

  let result = `${schedule.open} - ${schedule.close}`;
  if (schedule.open2 && schedule.close2) {
    result += ` / ${schedule.open2} - ${schedule.close2}`;
  }
  return result;
}

export function parseOpeningHours(json: string): OpeningHours {
  return JSON.parse(json) as OpeningHours;
}

export function getNowInItaly() {
  const now = new Date();
  const italyTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Europe/Rome" }),
  );
  return italyTime;
}

// Parse a UTC datetime string from D1 and check if it's still in the future
// D1 stores datetime('now') as UTC without a Z suffix, so we append it
export function isUtcDatetimeInFuture(utcDatetime: string) {
  const normalized = utcDatetime.endsWith("Z") ? utcDatetime : utcDatetime + "Z";
  return new Date(normalized).getTime() > Date.now();
}

// Format a UTC datetime string from D1 as Italian local time
export function formatUtcAsItalianTime(utcDatetime: string) {
  const normalized = utcDatetime.endsWith("Z") ? utcDatetime : utcDatetime + "Z";
  return new Date(normalized).toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Rome",
  });
}
