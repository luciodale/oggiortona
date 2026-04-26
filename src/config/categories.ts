import type { TranslationKey } from "../i18n/t";
import { t } from "../i18n/t";
import type { Locale } from "../types/domain";

export function eventCategoryLabels(locale: Locale): Record<string, string> {
  const result: Record<string, string> = {};
  for (const key of eventCategories) {
    result[key] = t(`eventCategory.${key}` as TranslationKey, locale);
  }
  return result;
}

export const eventCategoryColors: Record<string, string> = {
  cibo: "bg-cat-cibo-bg text-cat-cibo",
  cultura: "bg-cat-cultura-bg text-cat-cultura",
  sport: "bg-cat-sport-bg text-cat-sport",
  altro: "bg-cat-altro-bg text-cat-altro",
};


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
  "cultura",
  "altro",
];
