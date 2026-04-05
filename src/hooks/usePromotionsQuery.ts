import { useQuery } from "@tanstack/react-query";
import type { PromotionsResponse } from "../types/api";

export function usePromotionsQuery(restaurantId: string) {
  const { data, isLoading } = useQuery<PromotionsResponse>({
    queryKey: ["promotions", restaurantId],
    queryFn: () =>
      fetch(`/api/my-restaurants/${restaurantId}/promotions`).then((r) => r.json()),
  });

  return {
    items: data?.items ?? [],
    restaurantName: data?.restaurantName ?? "",
    activeCount: data?.activeCount ?? 0,
    loading: isLoading,
  };
}
