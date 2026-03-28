import { useState, useEffect } from "react";
import type { RestaurantWithStatus } from "../types/domain";

export function useUserRestaurants() {
  const [restaurants, setRestaurants] = useState<Array<RestaurantWithStatus>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/my-restaurants")
      .then((r) => r.json() as Promise<{ restaurants: Array<RestaurantWithStatus> }>)
      .then((data) => setRestaurants(data.restaurants))
      .finally(() => setLoading(false));
  }, []);

  return { restaurants, loading };
}
