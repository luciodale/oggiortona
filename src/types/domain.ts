// Enriched/computed types for UI — extend database types with runtime fields.

export type Locale = "it" | "en";

export type PushScope = "admin" | "owner" | "general";

import type {
  EventRow,
  PromotionRow,
  OpeningHours,
  RestaurantRow,
} from "./database";
import type { RestaurantFormInitialData } from "../hooks/useRestaurantForm";
import type { EventFormInitialData } from "../hooks/useEventForm";

export type RestaurantWithStatus = RestaurantRow & {
  types: Array<string>;
  isOpen: boolean;
  promotions: Array<PromotionRow>;
  parsedHours: OpeningHours;
  expiredPromotionCount: number;
  linkedEventCount: number;
};

export type EventWithRestaurant = EventRow & {
  restaurantName: string | null;
};

export type SheetMeta =
  | { kind: "restaurant"; data: RestaurantWithStatus }
  | { kind: "event"; data: EventWithRestaurant };

export function isSheetMeta(value: unknown): value is SheetMeta {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (v.kind === "restaurant" || v.kind === "event") && v.data != null;
}

export type FormSheetMeta =
  | { kind: "restaurant-form"; restaurantId?: number; initialData?: RestaurantFormInitialData }
  | { kind: "event-form"; eventId?: number; initialData?: EventFormInitialData }
  | { kind: "storefront"; restaurantId: number }
  | { kind: "promotions-list"; restaurantId: number };

export function isFormSheetMeta(value: unknown): value is FormSheetMeta {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return v.kind === "restaurant-form" || v.kind === "event-form" || v.kind === "storefront" || v.kind === "promotions-list";
}
