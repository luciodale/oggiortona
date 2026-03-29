import { useQuery } from "@tanstack/react-query";
import type { RestaurantWithStatus } from "../types/domain";

export function useRestaurantDetail(id: string | undefined) {
  const { data, isLoading } = useQuery<{ restaurant: RestaurantWithStatus }>({
    queryKey: ["restaurant", id],
    queryFn: () => fetch(`/api/restaurants/${id}`).then((r) => r.json()),
    enabled: !!id,
  });

  return { restaurant: data?.restaurant ?? null, loading: isLoading };
}
