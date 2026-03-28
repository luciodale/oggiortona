import { useState, useEffect } from "react";
import type { EventRow } from "../types/database";

export function useUserEvents() {
  const [events, setEvents] = useState<Array<EventRow>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/my-events")
      .then((r) => r.json() as Promise<{ events: Array<EventRow> }>)
      .then((data) => setEvents(data.events))
      .finally(() => setLoading(false));
  }, []);

  return { events, loading };
}
