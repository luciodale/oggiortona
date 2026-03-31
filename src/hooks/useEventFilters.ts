import { useState, useMemo } from "react";
import type { EventRow } from "../types/database";
import { isThisWeek, isToday } from "../utils/date";
import { eventFilterCategories } from "../config/categories";

const KNOWN_CATEGORIES = new Set(eventFilterCategories.filter((c) => c !== "altro"));

export type TimeFilter = "oggi" | "tutti" | "passati";

type EventGroups = {
  thisWeek: Array<EventRow>;
  upcoming: Array<EventRow>;
  past: Array<EventRow>;
};

function eventCategories(event: EventRow): Array<string> {
  return event.category.split(",").map((c) => c.trim());
}

function matchesCategory(event: EventRow, filter: string): boolean {
  if (filter === "all") return true;
  const cats = eventCategories(event);
  if (filter === "altro") return cats.some((c) => !KNOWN_CATEGORIES.has(c));
  return cats.includes(filter);
}

function matchesTime(event: EventRow, filter: TimeFilter): boolean {
  if (filter === "tutti" || filter === "passati") return true;
  return isToday(event.dateStart, event.dateEnd);
}

type UseEventFiltersParams = {
  events: Array<EventRow>;
  pastEvents: Array<EventRow>;
  timeFilter: TimeFilter;
};

export function useEventFilters({ events, pastEvents, timeFilter }: UseEventFiltersParams) {
  const [category, setCategory] = useState<string>("all");

  const isPast = timeFilter === "passati";
  const source = isPast ? pastEvents : events;

  const filtered = useMemo(
    () => source.filter((e) => matchesTime(e, timeFilter) && matchesCategory(e, category)),
    [source, timeFilter, category],
  );

  const grouped = useMemo<EventGroups>(() => {
    if (isPast) return { thisWeek: [], upcoming: [], past: filtered };

    const thisWeek: Array<EventRow> = [];
    const upcoming: Array<EventRow> = [];

    for (const event of filtered) {
      if (isThisWeek(event.dateStart, event.dateEnd)) {
        thisWeek.push(event);
      } else {
        upcoming.push(event);
      }
    }

    return { thisWeek, upcoming, past: [] };
  }, [filtered, isPast]);

  return { category, setCategory, filtered, grouped };
}
