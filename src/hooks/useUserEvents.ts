import { useQuery } from "@tanstack/react-query";
import type { EventWithRestaurant } from "../types/domain";

export function useUserEvents() {
  const { data, isLoading } = useQuery<{ events: Array<EventWithRestaurant> }>({
    queryKey: ["my-events"],
    queryFn: () => fetch("/api/my-events").then((r) => r.json()),
  });

  return { events: data?.events ?? [], loading: isLoading };
}
