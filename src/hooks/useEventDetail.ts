import { useState, useEffect } from "react";
import type { EventRow } from "../types/database";

export function useEventDetail(id: string | undefined) {
  const [event, setEvent] = useState<EventRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    fetch(`/api/events/${id}`)
      .then((res) => res.json() as Promise<{ event: EventRow }>)
      .then((data) => setEvent(data.event))
      .finally(() => setLoading(false));
  }, [id]);

  return { event, loading };
}
