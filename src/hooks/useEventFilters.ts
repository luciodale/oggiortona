import { useState, useMemo } from "react";
import type { EventWithRestaurant } from "../types/domain";
import { isThisWeek, isToday } from "../utils/date";

export type TimeFilter = "oggi" | "tutti" | "passati";

type EventGroups = {
  thisWeek: Array<EventWithRestaurant>;
  upcoming: Array<EventWithRestaurant>;
  past: Array<EventWithRestaurant>;
};

const MAIN_CATEGORIES = ["sport", "cibo", "cultura"];

function eventCategories(event: EventWithRestaurant): Array<string> {
  return event.category.split(",").map((c) => c.trim());
}

function matchesCategory(event: EventWithRestaurant, filter: string): boolean {
  if (filter === "all") return true;
  const cats = eventCategories(event);
  if (filter === "altro") return !cats.some((c) => MAIN_CATEGORIES.includes(c));
  return cats.includes(filter);
}

function matchesTime(event: EventWithRestaurant, filter: TimeFilter): boolean {
  if (filter === "tutti" || filter === "passati") return true;
  return isToday(event.dateStart, event.dateEnd);
}

type UseEventFiltersParams = {
  events: Array<EventWithRestaurant>;
  pastEvents: Array<EventWithRestaurant>;
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

    const thisWeek: Array<EventWithRestaurant> = [];
    const upcoming: Array<EventWithRestaurant> = [];

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
