import type { RestaurantType } from "../types/database";

export function parseTypes(typeStr: string): Array<RestaurantType> {
  return typeStr.split(",").map((t) => t.trim()) as Array<RestaurantType>;
}
