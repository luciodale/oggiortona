import { useQuery } from "@tanstack/react-query";
import { EventsView } from "../components/events/EventsView";
import type { EventRow } from "../types/database";

export function EventsRoute() {
  const { data, isLoading } = useQuery<{ events: Array<EventRow> }>({
    queryKey: ["events"],
    queryFn: () => fetch("/api/events").then((r) => r.json()),
  });

  return (
    <>
      <EventsView events={data?.events ?? []} isLoading={isLoading} />
      <div className="zipper-spacer" aria-hidden="true" />
    </>
  );
}
