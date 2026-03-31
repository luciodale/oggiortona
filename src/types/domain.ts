// Enriched/computed types for UI — extend database types with runtime fields.

export type Locale = "it" | "en";

export type PushScope = "admin" | "owner" | "general";

import type {
  EventRow,
  PromotionRow,
  OpeningHours,
  RestaurantRow,
} from "./database";

export type RestaurantWithStatus = RestaurantRow & {
  types: Array<string>;
  isOpen: boolean;
  promotions: Array<PromotionRow>;
  parsedHours: OpeningHours;
  expiredPromotionCount: number;
};

export type SheetMeta =
  | { kind: "restaurant"; data: RestaurantWithStatus }
  | { kind: "event"; data: EventRow };

export function isSheetMeta(value: unknown): value is SheetMeta {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (v.kind === "restaurant" || v.kind === "event") && v.data != null;
}
