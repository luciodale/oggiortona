import { useQuery } from "@tanstack/react-query";
import { EventsView } from "../components/events/EventsView";
import type { EventWithRestaurant } from "../types/domain";

export function EventsRoute() {
  const { data, isLoading } = useQuery<{ events: Array<EventWithRestaurant> }>({
    queryKey: ["events"],
    queryFn: () => fetch("/api/events").then((r) => r.json()),
    staleTime: 0,
  });

  return (
    <>
      <EventsView events={data?.events ?? []} isLoading={isLoading} />
      <div className="zipper-spacer" aria-hidden="true" />
    </>
  );
}
