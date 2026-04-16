// API request/response contracts — compose database types.

import type {
  EventRow,
  PromotionRow,
  RestaurantRow,
  UserRow,
} from "./database";
import type { RestaurantWithStatus } from "./domain";
import type {
  CreateRestaurantApiPayload,
  UpdateRestaurantApiPayload,
} from "../schemas/restaurant";

// -- Restaurants --

export type RestaurantListParams = {
  type?: string;
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

export type CreateRestaurantRequest = CreateRestaurantApiPayload;

export type UpdateRestaurantRequest = UpdateRestaurantApiPayload;

// -- Dashboard --

export type DashboardRestaurant = RestaurantRow & {
  promotions: Array<PromotionRow>;
};

export type DashboardResponse = {
  user: UserRow;
  restaurants: Array<DashboardRestaurant>;
};

// -- Promotions --

export type CooldownSnapshot = {
  max: number;
  windowHours: number;
  used: number;
  nextSlotAt: string | null;
  remainingMs: number | null;
};

export type PromotionsResponse = {
  restaurantName: string;
  items: Array<PromotionRow>;
  cooldown: CooldownSnapshot;
};

// -- Admin --

export type AdminRestaurantsResponse = {
  restaurants: Array<DashboardRestaurant>;
};

export type AdminEventsResponse = {
  events: Array<EventRow>;
};

// -- Shared --

export type ApiError = {
  error: string;
  status: number;
};
