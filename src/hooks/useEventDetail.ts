import { useQuery } from "@tanstack/react-query";
import type { EventRow } from "../types/database";

export function useEventDetail(id: string | undefined) {
  const { data, isLoading } = useQuery<{ event: EventRow }>({
    queryKey: ["event", id],
    queryFn: () => fetch(`/api/events/${id}`).then((r) => r.json()),
    enabled: !!id,
  });

  return { event: data?.event ?? null, loading: isLoading };
}
