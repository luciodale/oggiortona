import { getTodayISO } from "./date";
import type { PromotionRow } from "../types/database";
import type { Locale } from "../types/domain";
import { t } from "../i18n/t";

export type BadgeStyle = { label: string; cls: string };

const BADGE_CLS: Record<string, string> = {
  special: "bg-mangiare-light text-mangiare",
  deal: "bg-violet-50 text-violet-700",
  news: "bg-sky-50 text-sky-700",
};

const BADGE_KEYS: Record<string, "promo.dailySpecial" | "promo.deal" | "promo.news"> = {
  special: "promo.dailySpecial",
  deal: "promo.deal",
  news: "promo.news",
};

export function isPromotionExpired(item: PromotionRow) {
  return item.dateEnd < getTodayISO();
}

export function getBadgeStyle(type: string, locale: Locale): BadgeStyle {
  const key = BADGE_KEYS[type] ?? "promo.news";
  return { label: t(key, locale), cls: BADGE_CLS[type] ?? "bg-sky-50 text-sky-700" };
}
