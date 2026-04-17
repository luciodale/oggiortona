import { useQuery } from "@tanstack/react-query";
import type { StoreWithStatus } from "../types/domain";

export function useUserStores() {
  const { data, isLoading } = useQuery<{ stores: Array<StoreWithStatus> }>({
    queryKey: ["my-stores"],
    queryFn: () => fetch("/api/my-stores").then((r) => r.json()),
  });

  return { stores: data?.stores ?? [], loading: isLoading };
}
