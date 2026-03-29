// Enriched/computed types for UI — extend database types with runtime fields.

export type Locale = "it" | "en";

import type {
  PromotionRow,
  OpeningHours,
  RestaurantRow,
} from "./database";

export type RestaurantWithStatus = RestaurantRow & {
  types: Array<string>;
  isOpen: boolean;
  promotions: Array<PromotionRow>;
  parsedHours: OpeningHours;
};
