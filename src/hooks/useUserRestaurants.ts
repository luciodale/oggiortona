import { useQuery } from "@tanstack/react-query";
import type { RestaurantWithStatus } from "../types/domain";

export function useUserRestaurants() {
  const { data, isLoading } = useQuery<{ restaurants: Array<RestaurantWithStatus> }>({
    queryKey: ["my-restaurants"],
    queryFn: () => fetch("/api/my-restaurants").then((r) => r.json()),
  });

  return { restaurants: data?.restaurants ?? [], loading: isLoading };
}
