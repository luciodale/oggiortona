import { getTodayISO } from "./date";
import type { PromotionRow } from "../types/database";
import type { Locale } from "../types/domain";
import { t } from "../i18n/t";

export type BadgeStyle = { label: string; cls: string };

const BADGE_CLS: Record<string, string> = {
  generale: "bg-promo-generale-bg text-promo-generale",
  special: "bg-mangiare-light text-mangiare",
  deal: "bg-promo-deal-bg text-promo-deal",
  news: "bg-promo-news-bg text-promo-news",
};

const BADGE_KEYS: Record<string, "promo.generale" | "promo.dailySpecial" | "promo.deal" | "promo.news"> = {
  generale: "promo.generale",
  special: "promo.dailySpecial",
  deal: "promo.deal",
  news: "promo.news",
};

export function isPromotionExpired(item: PromotionRow) {
  return item.dateEnd < getTodayISO();
}

export function getBadgeStyle(type: string, locale: Locale): BadgeStyle {
  const key = BADGE_KEYS[type] ?? "promo.generale";
  return { label: t(key, locale), cls: BADGE_CLS[type] ?? "bg-promo-generale-bg text-promo-generale" };
}
