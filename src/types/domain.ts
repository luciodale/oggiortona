// Enriched/computed types for UI — extend database types with runtime fields.

export type Locale = "it" | "en";

export type PushScope = "admin" | "owner" | "general";

import type {
  EventRow,
  PromotionRow,
  OpeningHours,
  RestaurantRow,
  StoreRow,
  StorePromotionRow,
} from "./database";
import type { RestaurantFormInitialData } from "../hooks/useRestaurantForm";
import type { StoreFormInitialData } from "../hooks/useStoreForm";
import type { EventFormInitialData } from "../hooks/useEventForm";

export type RestaurantWithStatus = RestaurantRow & {
  types: Array<string>;
  cuisineList: Array<string>;
  isOpen: boolean;
  promotions: Array<PromotionRow>;
  parsedHours: OpeningHours;
  expiredPromotionCount: number;
  linkedEventCount: number;
};

export type StoreWithStatus = StoreRow & {
  types: Array<string>;
  isOpen: boolean;
  promotions: Array<StorePromotionRow>;
  parsedHours: OpeningHours;
  expiredPromotionCount: number;
  linkedEventCount: number;
};

export type EventWithRestaurant = EventRow & {
  restaurantName: string | null;
  storeName: string | null;
};

export type SheetMeta =
  | { kind: "restaurant"; data: RestaurantWithStatus }
  | { kind: "store"; data: StoreWithStatus }
  | { kind: "event"; data: EventWithRestaurant };

export function isSheetMeta(value: unknown): value is SheetMeta {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (v.kind === "restaurant" || v.kind === "store" || v.kind === "event") && v.data != null;
}

export type FormSheetMeta =
  | { kind: "restaurant-form"; restaurantId?: number; initialData?: RestaurantFormInitialData }
  | { kind: "store-form"; storeId?: number; initialData?: StoreFormInitialData }
  | { kind: "event-form"; eventId?: number; initialData?: EventFormInitialData }
  | { kind: "storefront"; restaurantId: number }
  | { kind: "store-storefront"; storeId: number }
  | { kind: "promotions-list"; restaurantId: number }
  | { kind: "store-promotions-list"; storeId: number }
  | { kind: "promotion-edit"; restaurantId: number; promotion: PromotionRow }
  | { kind: "store-promotion-edit"; storeId: number; promotion: StorePromotionRow };

export function isFormSheetMeta(value: unknown): value is FormSheetMeta {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return v.kind === "restaurant-form"
    || v.kind === "store-form"
    || v.kind === "event-form"
    || v.kind === "storefront"
    || v.kind === "store-storefront"
    || v.kind === "promotions-list"
    || v.kind === "store-promotions-list"
    || v.kind === "promotion-edit"
    || v.kind === "store-promotion-edit";
}
