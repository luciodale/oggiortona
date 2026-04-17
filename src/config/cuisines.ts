import type { TranslationKey } from "../i18n/t";
import { t } from "../i18n/t";
import type { Locale } from "../types/domain";

export const restaurantCuisines = [
  "carne",
  "pesce",
  "pizza",
  "pasta",
  "vegetariano",
  "dolci",
  "aperitivo",
  "caffe",
] as const;

export type RestaurantCuisine = typeof restaurantCuisines[number];

export const restaurantCuisineColors: Record<string, string> = {
  carne: "bg-cuisine-meat-bg text-cuisine-meat",
  pesce: "bg-cuisine-fish-bg text-cuisine-fish",
  pizza: "bg-cuisine-pizza-bg text-cuisine-pizza",
  pasta: "bg-cuisine-pasta-bg text-cuisine-pasta",
  vegetariano: "bg-cuisine-veg-bg text-cuisine-veg",
  dolci: "bg-cuisine-sweet-bg text-cuisine-sweet",
  aperitivo: "bg-cuisine-drink-bg text-cuisine-drink",
  caffe: "bg-cuisine-coffee-bg text-cuisine-coffee",
};

export function restaurantCuisineLabels(locale: Locale): Record<string, string> {
  const result: Record<string, string> = {};
  for (const key of restaurantCuisines) {
    result[key] = t(`cuisine.${key}` as TranslationKey, locale);
  }
  return result;
}

export function isRestaurantCuisine(value: string): value is RestaurantCuisine {
  return (restaurantCuisines as ReadonlyArray<string>).includes(value);
}
