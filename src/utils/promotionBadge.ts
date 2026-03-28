import { getTodayISO } from "./date";
import type { PromotionRow } from "../types/database";

export type BadgeStyle = { label: string; cls: string };

const BADGE_FALLBACK: BadgeStyle = { label: "News", cls: "bg-sky-50 text-sky-700" };

const BADGE_STYLES: Record<string, BadgeStyle> = {
  special: { label: "Piatto del giorno", cls: "bg-mangiare-light text-mangiare" },
  deal: { label: "Offerta", cls: "bg-violet-50 text-violet-700" },
  news: BADGE_FALLBACK,
};

export function isPromotionExpired(item: PromotionRow) {
  return item.dateEnd < getTodayISO();
}

export function getBadgeStyle(type: string): BadgeStyle {
  return BADGE_STYLES[type] ?? BADGE_FALLBACK;
}
