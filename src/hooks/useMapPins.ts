import { useMemo } from "react";
import type { RestaurantWithStatus, Locale } from "../types/domain";
import type { MapPin } from "../utils/map";
import { restaurantTypeLabels } from "../config/categories";
import { useLocale } from "../i18n/useLocale";

export function restaurantsToMapPins(restaurants: Array<RestaurantWithStatus>, locale: Locale): Array<MapPin> {
  const typeLabels = restaurantTypeLabels(locale);
  return restaurants
    .filter((r) => r.latitude != null && r.longitude != null)
    .map((r) => {
      const special = r.promotions.find((p) => p.type === "special");
      const deal = r.promotions.find((p) => p.type === "deal");
      const news = r.promotions.find((p) => p.type === "news");
      return {
        id: r.id,
        lat: r.latitude!,
        lng: r.longitude!,
        label: r.name,
        subtitle: r.types.map((t) => typeLabels[t] ?? t).join(" · "),
        href: `/restaurants/${r.id}`,
        directionsUrl:
          r.latitude != null && r.longitude != null
            ? `https://www.google.com/maps/search/?api=1&query=${r.latitude},${r.longitude}`
            : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.address)}`,
        color: r.isOpen ? "#c4512a" : "#8c7e6f",
        variant: "restaurant" as const,
        isOpen: r.isOpen,
        priceRange: r.priceRange,
        special: special
          ? { description: special.title, price: special.price }
          : null,
        deal: deal
          ? {
              title: deal.title,
              description: deal.description,
              validUntil: deal.dateEnd,
            }
          : null,
        news: news
          ? {
              title: news.title,
              description: news.description,
            }
          : null,
      };
    });
}

export function useMapPins(restaurants: Array<RestaurantWithStatus>) {
  const { locale } = useLocale();
  return useMemo(() => restaurantsToMapPins(restaurants, locale), [restaurants, locale]);
}
