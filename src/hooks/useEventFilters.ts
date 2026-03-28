import { useState, useMemo } from "react";
import type { EventCategory, EventRow } from "../types/database";
import { isThisWeek } from "../utils/date";

type EventGroups = {
  thisWeek: Array<EventRow>;
  upcoming: Array<EventRow>;
};

export function useEventFilters(events: Array<EventRow>) {
  const [category, setCategory] = useState<EventCategory | "all">("all");

  const filtered = useMemo(() => {
    if (category === "all") return events;
    return events.filter((e) => e.category === category);
  }, [events, category]);

  const grouped = useMemo<EventGroups>(() => {
    const thisWeek: Array<EventRow> = [];
    const upcoming: Array<EventRow> = [];

    for (const event of filtered) {
      if (isThisWeek(event.date_start)) {
        thisWeek.push(event);
      } else {
        upcoming.push(event);
      }
    }

    return { thisWeek, upcoming };
  }, [filtered]);

  return { category, setCategory, filtered, grouped };
}
