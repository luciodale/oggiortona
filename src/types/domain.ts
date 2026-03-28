// Enriched/computed types for UI — extend database types with runtime fields.

import type {
  DailySpecialRow,
  DealRow,
  OpeningHours,
  RestaurantRow,
  RestaurantType,
} from "./database";

export type RestaurantWithStatus = Omit<RestaurantRow, "opening_hours" | "type"> & {
  types: Array<RestaurantType>;
  is_open: boolean;
  today_special: DailySpecialRow | null;
  active_deal: DealRow | null;
  parsed_hours: OpeningHours;
};
