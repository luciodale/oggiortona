import { useMemo } from "react";
import type { EventRow } from "../types/database";
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

function eventSubtitle(event: EventRow, locale: Locale) {
  const catLabels = eventCategoryLabels(locale);
  const cats = event.category
    .split(",")
    .map((c) => c.trim())
    .map((c) => catLabels[c] ?? c)
    .join(" · ");

  const date = formatDateShort(event.dateStart, locale);
  return `${date} · ${cats}`;
}

function eventsToMapPins(events: Array<EventRow>, locale: Locale): Array<MapPin> {
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
      href: `/events/${e.id}`,
      directionsUrl:
        e.latitude != null && e.longitude != null
          ? `https://www.google.com/maps/search/?api=1&query=${e.latitude},${e.longitude}`
          : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(e.address)}`,
      color: isToday(e.dateStart, e.dateEnd) ? todayColor : baseColor,
      variant: "event" as const,
    }));
}

export function useEventMapPins(events: Array<EventRow>) {
  const { locale } = useLocale();
  return useMemo(() => eventsToMapPins(events, locale), [events, locale]);
}
