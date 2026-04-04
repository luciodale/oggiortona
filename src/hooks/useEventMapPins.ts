import { useMemo } from "react";
import type { EventWithRestaurant } from "../types/domain";
import type { Locale } from "../types/domain";
import type { MapPin } from "../utils/map";
import { getThemeColor } from "../utils/map";
import { eventCategoryLabels } from "../config/categories";
import { formatDateShort } from "../utils/date";
import { useLocale } from "../i18n/useLocale";

function isToday(dateStart: string, dateEnd: string | null) {
  const today = new Date().toISOString().slice(0, 10);
  if (dateEnd) return dateStart <= today && today <= dateEnd;
  return dateStart === today;
}

function eventSubtitle(event: EventWithRestaurant, locale: Locale) {
  const catLabels = eventCategoryLabels(locale);
  const cats = event.category
    .split(",")
    .map((c) => c.trim())
    .map((c) => catLabels[c] ?? c)
    .join(" · ");

  const date = formatDateShort(event.dateStart, locale);
  return `${date} · ${cats}`;
}

type PinLabels = MapPin["labels"];

function eventsToMapPins(events: Array<EventWithRestaurant>, locale: Locale, pinLabels?: PinLabels): Array<MapPin> {
  const todayColor = getThemeColor("--color-success") || "#4a7c59";
  const baseColor = getThemeColor("--color-fare") || "#3d6b8e";
  return events
    .filter((e) => e.latitude != null && e.longitude != null)
    .map((e) => ({
      id: e.id,
      lat: e.latitude!,
      lng: e.longitude!,
      label: e.title,
      subtitle: eventSubtitle(e, locale),
      directionsUrl:
        e.latitude != null && e.longitude != null
          ? `https://www.google.com/maps/search/?api=1&query=${e.latitude},${e.longitude}`
          : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(e.address)}`,
      color: isToday(e.dateStart, e.dateEnd) ? todayColor : baseColor,
      variant: "event" as const,
      labels: pinLabels,
    }));
}

export function useEventMapPins(events: Array<EventWithRestaurant>) {
  const { locale, t } = useLocale();
  const pinLabels: PinLabels = useMemo(() => ({
    details: t("common.details"),
    directions: t("common.directions"),
  }), [t]);
  return useMemo(() => eventsToMapPins(events, locale, pinLabels), [events, locale, pinLabels]);
}
