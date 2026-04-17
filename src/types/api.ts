// API request/response contracts — compose database types.

import type {
  EventRow,
  PromotionRow,
  RestaurantRow,
  StorePromotionRow,
  StoreRow,
  UserRow,
} from "./database";
import type { RestaurantWithStatus, StoreWithStatus } from "./domain";
import type {
  CreateRestaurantApiPayload,
  UpdateRestaurantApiPayload,
} from "../schemas/restaurant";
import type {
  CreateStoreApiPayload,
  UpdateStoreApiPayload,
} from "../schemas/store";

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

// -- Stores --

export type StoreListParams = {
  type?: string;
  open_now?: boolean;
  has_special?: boolean;
  sort?: "name";
};

export type StoreListResponse = {
  stores: Array<StoreWithStatus>;
  count: number;
};

export type StoreDetailResponse = {
  store: StoreWithStatus;
};

export type CreateStoreRequest = CreateStoreApiPayload;

export type UpdateStoreRequest = UpdateStoreApiPayload;

// -- Dashboard --

export type DashboardRestaurant = RestaurantRow & {
  promotions: Array<PromotionRow>;
};

export type DashboardStore = StoreRow & {
  promotions: Array<StorePromotionRow>;
};

export type DashboardResponse = {
  user: UserRow;
  restaurants: Array<DashboardRestaurant>;
  stores: Array<DashboardStore>;
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

export type StorePromotionsResponse = {
  storeName: string;
  items: Array<StorePromotionRow>;
  cooldown: CooldownSnapshot;
};

// -- Admin --

export type AdminRestaurantsResponse = {
  restaurants: Array<DashboardRestaurant>;
};

export type AdminStoresResponse = {
  stores: Array<DashboardStore>;
};

export type AdminEventsResponse = {
  events: Array<EventRow>;
};

// -- Shared --

export type ApiError = {
  error: string;
  status: number;
};
