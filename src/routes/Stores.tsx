import { useQuery } from "@tanstack/react-query";
import { StoresView } from "../components/stores/StoresView";
import { useSpaAuth } from "../hooks/useSpaAuth";
import type { StoreWithStatus } from "../types/domain";

export function StoresRoute() {
  const { user } = useSpaAuth();

  const { data: storeData, isLoading } = useQuery<{ stores: Array<StoreWithStatus> }>({
    queryKey: ["stores"],
    queryFn: () => fetch("/api/stores").then((r) => r.json()),
    staleTime: 0,
  });

  const { data: pinsData } = useQuery<{ storeIds: Array<number> }>({
    queryKey: ["store-pins"],
    queryFn: () => fetch("/api/store-pins").then((r) => r.json()),
    enabled: !!user,
  });

  return (
    <>
      <StoresView
        stores={storeData?.stores ?? []}
        isLoading={isLoading}
        isLoggedIn={!!user}
        initialPinnedIds={pinsData?.storeIds ?? []}
      />
      <div className="zipper-spacer" aria-hidden="true" />
    </>
  );
}
