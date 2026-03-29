import { useQuery } from "@tanstack/react-query";
import type { PromotionRow } from "../types/database";

type PromotionsResponse = {
  items: Array<PromotionRow>;
  restaurantName: string;
};

export function usePromotionsQuery(restaurantId: string) {
  const { data, isLoading } = useQuery<PromotionsResponse>({
    queryKey: ["promotions", restaurantId],
    queryFn: () =>
      fetch(`/api/my-restaurants/${restaurantId}/promotions`).then((r) => r.json()),
  });

  return {
    items: data?.items ?? [],
    restaurantName: data?.restaurantName ?? "",
    loading: isLoading,
  };
}
