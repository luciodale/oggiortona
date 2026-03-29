import { it } from "./it";
import { en } from "./en";
import type { Locale } from "../types/domain";

export type TranslationKey = keyof typeof it;

const translations: Record<Locale, Record<TranslationKey, string>> = { it, en };

export function t(key: TranslationKey, locale: Locale, params?: Record<string, string | number>) {
  let value: string = translations[locale][key];
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      value = value.replace(`{${k}}`, String(v));
    }
  }
  return value;
}

export const WEEKDAYS_SHORT: Record<Locale, ReadonlyArray<string>> = {
  it: ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"],
  en: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
};

export const MONTH_NAMES: Record<Locale, ReadonlyArray<string>> = {
  it: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
};

export const MONTH_NAMES_LOWER: Record<Locale, ReadonlyArray<string>> = {
  it: ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"],
  en: ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"],
};

export const DAY_NAMES: Record<Locale, ReadonlyArray<string>> = {
  it: ["Domenica", "Lunedi", "Martedi", "Mercoledi", "Giovedi", "Venerdi", "Sabato"],
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
};

export const DAY_LABELS: Record<Locale, Record<string, string>> = {
  it: {
    lunedi: "Lunedi",
    martedi: "Martedi",
    mercoledi: "Mercoledi",
    giovedi: "Giovedi",
    venerdi: "Venerdi",
    sabato: "Sabato",
    domenica: "Domenica",
  },
  en: {
    lunedi: "Monday",
    martedi: "Tuesday",
    mercoledi: "Wednesday",
    giovedi: "Thursday",
    venerdi: "Friday",
    sabato: "Saturday",
    domenica: "Sunday",
  },
};
