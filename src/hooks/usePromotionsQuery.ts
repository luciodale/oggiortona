import { useQuery } from "@tanstack/react-query";
import type { CooldownSnapshot, PromotionsResponse } from "../types/api";

const EMPTY_COOLDOWN: CooldownSnapshot = {
  max: 3,
  windowHours: 12,
  used: 0,
  nextSlotAt: null,
  remainingMs: null,
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
    cooldown: data?.cooldown ?? EMPTY_COOLDOWN,
    loading: isLoading,
  };
}
