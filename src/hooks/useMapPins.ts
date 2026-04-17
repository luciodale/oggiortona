import { useMemo } from "react";
import type { RestaurantWithStatus, StoreWithStatus } from "../types/domain";
import type { MapPin } from "../utils/map";
import { getThemeColor } from "../utils/map";
import { useLocale } from "../i18n/useLocale";

type PinLabels = MapPin["labels"];

export function restaurantsToMapPins(restaurants: Array<RestaurantWithStatus>, pinLabels?: PinLabels): Array<MapPin> {
  const openColor = getThemeColor("--color-success") || "#4a7c59";
  const closedColor = getThemeColor("--color-danger") || "#b84233";
  return restaurants
    .filter((r) => r.latitude != null && r.longitude != null)
    .map((r) => {
      return {
        id: r.id,
        lat: r.latitude!,
        lng: r.longitude!,
        label: r.name,
        subtitle: r.types.join(" · "),
        directionsUrl:
          r.latitude != null && r.longitude != null
            ? `https://www.google.com/maps/search/?api=1&query=${r.latitude},${r.longitude}`
            : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.address)}`,
        color: r.isOpen ? openColor : closedColor,
        variant: "restaurant" as const,
        isOpen: r.isOpen,
        priceRange: r.priceRange,
        promotions: r.promotions,
        labels: pinLabels,
      };
    });
}

export function storesToMapPins(stores: Array<StoreWithStatus>, pinLabels?: PinLabels): Array<MapPin> {
  const openColor = getThemeColor("--color-success") || "#4a7c59";
  const closedColor = getThemeColor("--color-danger") || "#b84233";
  return stores
    .filter((s) => s.latitude != null && s.longitude != null)
    .map((s) => {
      return {
        id: s.id,
        lat: s.latitude!,
        lng: s.longitude!,
        label: s.name,
        subtitle: s.types.join(" · "),
        directionsUrl:
          s.latitude != null && s.longitude != null
            ? `https://www.google.com/maps/search/?api=1&query=${s.latitude},${s.longitude}`
            : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.address)}`,
        color: s.isOpen ? openColor : closedColor,
        variant: "store" as const,
        isOpen: s.isOpen,
        promotions: s.promotions,
        labels: pinLabels,
      };
    });
}

export function useMapPins(restaurants: Array<RestaurantWithStatus>) {
  const { t } = useLocale();
  const pinLabels: PinLabels = useMemo(() => ({
    open: t("common.open"),
    closed: t("common.closed"),
    details: t("common.details"),
    directions: t("common.directions"),
  }), [t]);
  return useMemo(() => restaurantsToMapPins(restaurants, pinLabels), [restaurants, pinLabels]);
}

export function useStoreMapPins(stores: Array<StoreWithStatus>) {
  const { t } = useLocale();
  const pinLabels: PinLabels = useMemo(() => ({
    open: t("common.open"),
    closed: t("common.closed"),
    details: t("common.details"),
    directions: t("common.directions"),
  }), [t]);
  return useMemo(() => storesToMapPins(stores, pinLabels), [stores, pinLabels]);
}
