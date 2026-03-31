import type { TranslationKey } from "../i18n/t";
import { t } from "../i18n/t";
import type { Locale } from "../types/domain";

function buildLabels(keys: Array<string>, prefix: string, locale: Locale): Record<string, string> {
  const result: Record<string, string> = {};
  for (const key of keys) {
    result[key] = t(`${prefix}.${key}` as TranslationKey, locale);
  }
  return result;
}

export function restaurantTypeLabels(locale: Locale): Record<string, string> {
  return buildLabels(restaurantTypes, "category", locale);
}

export function eventCategoryLabels(locale: Locale): Record<string, string> {
  return buildLabels(eventCategories, "eventCategory", locale);
}

export const eventCategoryColors: Record<string, string> = {
  sagra: "bg-amber-50 text-amber-700",
  cibo: "bg-orange-50 text-orange-700",
  musica: "bg-violet-50 text-violet-700",
  mercato: "bg-emerald-50 text-emerald-700",
  cultura: "bg-sky-50 text-sky-700",
  sport: "bg-rose-50 text-rose-700",
  altro: "bg-stone-100 text-stone-600",
};

export const restaurantTypes = [
  "ristorante",
  "pizzeria",
  "trattoria",
  "bar",
  "gelateria",
  "pasticceria",
  "pescheria",
  "altro",
];

export const restaurantFormTypes = [
  "ristorante",
  "bar",
  "gelateria",
] as const;

export const eventFormCategories = [
  "sport",
  "cibo",
  "cultura",
  "altro",
] as const;

export const eventFilterCategories = [
  "sport",
  "cibo",
  "cultura",
  "altro",
];

export const eventCategories = [
  "sport",
  "cibo",
  "musica",
  "cultura",
  "altro",
];
