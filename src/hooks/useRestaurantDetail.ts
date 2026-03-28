import { useState, useEffect } from "react";
import type { RestaurantWithStatus } from "../types/domain";

export function useRestaurantDetail(id: string | undefined) {
  const [restaurant, setRestaurant] = useState<RestaurantWithStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    fetch(`/api/restaurants/${id}`)
      .then((res) => res.json() as Promise<{ restaurant: RestaurantWithStatus }>)
      .then((data) => setRestaurant(data.restaurant))
      .finally(() => setLoading(false));
  }, [id]);

  return { restaurant, loading };
}
