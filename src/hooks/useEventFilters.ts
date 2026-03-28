import { useState, useMemo } from "react";
import type { EventRow } from "../types/database";
import { isThisWeek, isToday } from "../utils/date";

const KNOWN_CATEGORIES = new Set(["sport", "musica", "cultura"]);

export type TimeFilter = "oggi" | "tutti";

type EventGroups = {
  thisWeek: Array<EventRow>;
  upcoming: Array<EventRow>;
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
  if (filter === "tutti") return true;
  return isToday(event.dateStart, event.dateEnd);
}

export function useEventFilters(events: Array<EventRow>) {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("tutti");
  const [category, setCategory] = useState<string>("all");

  const filtered = useMemo(
    () => events.filter((e) => matchesTime(e, timeFilter) && matchesCategory(e, category)),
    [events, timeFilter, category],
  );

  const grouped = useMemo<EventGroups>(() => {
    const thisWeek: Array<EventRow> = [];
    const upcoming: Array<EventRow> = [];

    for (const event of filtered) {
      if (isThisWeek(event.dateStart)) {
        thisWeek.push(event);
      } else {
        upcoming.push(event);
      }
    }

    return { thisWeek, upcoming };
  }, [filtered]);

  return { timeFilter, setTimeFilter, category, setCategory, filtered, grouped };
}
