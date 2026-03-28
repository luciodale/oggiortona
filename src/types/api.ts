// API request/response contracts — compose database types.

import type {
  DailySpecialRow,
  EventCategory,
  EventRow,
  RestaurantType,
} from "./database";
import type { RestaurantWithStatus } from "./domain";

// -- Restaurants --

export type RestaurantListParams = {
  type?: RestaurantType;
  open_now?: boolean;
  has_special?: boolean;
  sort?: "name" | "price_range";
};

export type RestaurantListResponse = {
  restaurants: Array<RestaurantWithStatus>;
  count: number;
};

export type RestaurantDetailResponse = {
  restaurant: RestaurantWithStatus;
};

// -- Daily Specials --

export type DailySpecialsResponse = {
  specials: Array<DailySpecialRow & { restaurant_name: string }>;
};

// -- Events --

export type EventListParams = {
  category?: EventCategory;
  period?: "this_week" | "upcoming" | "all";
};

export type EventListResponse = {
  events: Array<EventRow>;
  count: number;
};

export type EventDetailResponse = {
  event: EventRow;
};

// -- Shared --

export type ApiError = {
  error: string;
  status: number;
};
