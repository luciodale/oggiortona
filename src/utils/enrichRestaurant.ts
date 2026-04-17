import type { PromotionRow, RestaurantRow } from "../types/database";
import type { RestaurantWithStatus } from "../types/domain";
import { isOpenNow, parseOpeningHours } from "./time";
import { parseTypes } from "./restaurant";

export function groupPromotionsByRestaurant(allPromotions: Array<PromotionRow>) {
  const map = new Map<number, Array<PromotionRow>>();
  for (const p of allPromotions) {
    const list = map.get(p.restaurantId) ?? [];
    list.push(p);
    map.set(p.restaurantId, list);
  }
  return map;
}

export function enrichRestaurant(
  row: RestaurantRow,
  promotions: Array<PromotionRow>,
  expiredPromotionCount = 0,
  linkedEventCount = 0,
): RestaurantWithStatus {
  const parsedHours = parseOpeningHours(row.openingHours);
  return {
    ...row,
    types: parseTypes(row.type),
    cuisineList: row.cuisines ? parseTypes(row.cuisines) : [],
    isOpen: isOpenNow(parsedHours),
    promotions,
    parsedHours,
    expiredPromotionCount,
    linkedEventCount,
  };
}
