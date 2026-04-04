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
  sagra: "bg-cat-sagra-bg text-cat-sagra",
  cibo: "bg-cat-cibo-bg text-cat-cibo",
  musica: "bg-cat-musica-bg text-cat-musica",
  mercato: "bg-cat-mercato-bg text-cat-mercato",
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
];

export const eventCategories = [
  "sport",
  "cibo",
  "musica",
  "cultura",
  "altro",
];
