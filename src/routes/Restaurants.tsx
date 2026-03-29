import { useQuery } from "@tanstack/react-query";
import { RestaurantsView } from "../components/restaurants/RestaurantsView";
import { useSpaAuth } from "../hooks/useSpaAuth";
import type { RestaurantWithStatus } from "../types/domain";

export function RestaurantsRoute() {
  const { user } = useSpaAuth();

  const { data: restaurantData, isLoading } = useQuery<{ restaurants: Array<RestaurantWithStatus> }>({
    queryKey: ["restaurants"],
    queryFn: () => fetch("/api/restaurants").then((r) => r.json()),
  });

  const { data: pinsData } = useQuery<{ restaurantIds: Array<number> }>({
    queryKey: ["pins"],
    queryFn: () => fetch("/api/pins").then((r) => r.json()),
    enabled: !!user,
  });

  return (
    <>
      <RestaurantsView
        restaurants={restaurantData?.restaurants ?? []}
        isLoading={isLoading}
        isLoggedIn={!!user}
        initialPinnedIds={pinsData?.restaurantIds ?? []}
      />
      <div className="zipper-spacer" aria-hidden="true" />
    </>
  );
}
