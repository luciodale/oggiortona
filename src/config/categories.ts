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
  sagra: "bg-cat-sagra-bg text-cat-sagra",
  cibo: "bg-cat-cibo-bg text-cat-cibo",
  musica: "bg-cat-musica-bg text-cat-musica",
  mercato: "bg-cat-mercato-bg text-cat-mercato",
  cultura: "bg-cat-cultura-bg text-cat-cultura",
  sport: "bg-cat-sport-bg text-cat-sport",
  altro: "bg-cat-altro-bg text-cat-altro",
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
