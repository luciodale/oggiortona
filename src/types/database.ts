// All types inferred from Drizzle schema — single source of truth.

import type { InferSelectModel } from "drizzle-orm";
import type {
  users,
  restaurants,
  promotions,
  promotionBumps,
  events,
  pushSubscriptions,
  pinnedRestaurants,
  stores,
  storePromotions,
  storePromotionBumps,
  pinnedStores,
} from "../db/schema";

export type UserRow = InferSelectModel<typeof users>;
export type RestaurantRow = InferSelectModel<typeof restaurants>;
export type PromotionRow = InferSelectModel<typeof promotions>;
export type PromotionBumpRow = InferSelectModel<typeof promotionBumps>;
export type EventRow = InferSelectModel<typeof events>;
export type PushSubscriptionRow = InferSelectModel<typeof pushSubscriptions>;
export type PinnedRestaurantRow = InferSelectModel<typeof pinnedRestaurants>;
export type StoreRow = InferSelectModel<typeof stores>;
export type StorePromotionRow = InferSelectModel<typeof storePromotions>;
export type StorePromotionBumpRow = InferSelectModel<typeof storePromotionBumps>;
export type PinnedStoreRow = InferSelectModel<typeof pinnedStores>;

export type DaySchedule = {
  open: string;
  close: string;
  open2: string | null;
  close2: string | null;
};

export type OpeningHours = {
  lunedi: DaySchedule | null;
  martedi: DaySchedule | null;
  mercoledi: DaySchedule | null;
  giovedi: DaySchedule | null;
  venerdi: DaySchedule | null;
  sabato: DaySchedule | null;
  domenica: DaySchedule | null;
};

export type ItalianDay = keyof OpeningHours;
