import { useMemo } from "react";
import type { EventRow } from "../types/database";
import type { MapPin } from "../utils/map";
import { eventCategoryLabels } from "../config/categories";
import { formatDateShort } from "../utils/date";

function eventSubtitle(event: EventRow) {
  const cats = event.category
    .split(",")
    .map((c) => c.trim())
    .map((c) => eventCategoryLabels[c] ?? c)
    .join(" · ");

  const date = formatDateShort(event.dateStart);
  return `${date} · ${cats}`;
}

function eventsToMapPins(events: Array<EventRow>): Array<MapPin> {
  return events
    .filter((e) => e.latitude != null && e.longitude != null)
    .map((e) => ({
      id: e.id,
      lat: e.latitude!,
      lng: e.longitude!,
      label: e.title,
      subtitle: eventSubtitle(e),
      href: `/events/${e.id}`,
      directionsUrl:
        e.latitude != null && e.longitude != null
          ? `https://www.google.com/maps/search/?api=1&query=${e.latitude},${e.longitude}`
          : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(e.address)}`,
      color: "#6d28d9",
      variant: "event" as const,
    }));
}

export function useEventMapPins(events: Array<EventRow>) {
  return useMemo(() => eventsToMapPins(events), [events]);
}
