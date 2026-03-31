import { useQuery } from "@tanstack/react-query";
import type { EventRow } from "../types/database";

export function useUserEvents() {
  const { data, isLoading } = useQuery<{ events: Array<EventRow> }>({
    queryKey: ["my-events"],
    queryFn: () => fetch("/api/my-events").then((r) => r.json()),
  });

  return { events: data?.events ?? [], loading: isLoading };
}
