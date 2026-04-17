import { useQuery } from "@tanstack/react-query";
import type { CooldownSnapshot, StorePromotionsResponse } from "../types/api";

const EMPTY_COOLDOWN: CooldownSnapshot = {
  max: 3,
  windowHours: 12,
  used: 0,
  nextSlotAt: null,
  remainingMs: null,
};

export function useStorePromotionsQuery(storeId: string) {
  const { data, isLoading } = useQuery<StorePromotionsResponse>({
    queryKey: ["store-promotions", storeId],
    queryFn: () =>
      fetch(`/api/my-stores/${storeId}/promotions`).then((r) => r.json()),
  });

  return {
    items: data?.items ?? [],
    storeName: data?.storeName ?? "",
    cooldown: data?.cooldown ?? EMPTY_COOLDOWN,
    loading: isLoading,
  };
}
