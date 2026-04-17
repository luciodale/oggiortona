import { useState, useMemo, useEffect } from "react";
import type { RestaurantWithStatus } from "../types/domain";
import { isOpenNow } from "../utils/time";
import { getTodayISO } from "../utils/date";
import { sortRestaurants } from "../utils/sortRestaurants";

type Filters = {
  openNow: boolean;
  hasPromo: boolean;
};

export function useRestaurantFilters(restaurants: Array<RestaurantWithStatus>, pinnedIds: Set<number>) {
  const [filters, setFilters] = useState<Filters>({
    openNow: false,
    hasPromo: false,
  });
  const [cuisine, setCuisine] = useState<string>("all");

  // Tick every 60s to re-evaluate open status
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(interval);
  }, []);

  const filtered = useMemo(() => {
    const today = getTodayISO();

    let result = restaurants.map((r) => {
      // Re-evaluate promotion validity on the client
      const activePromotions = r.promotions.filter((p) => p.dateEnd >= today);

      return {
        ...r,
        isOpen: isOpenNow(r.parsedHours),
        promotions: activePromotions,
      };
    });

    if (filters.openNow) {
      result = result.filter((r) => r.isOpen);
    }
    if (filters.hasPromo) {
      result = result.filter((r) => r.promotions.length > 0);
    }
    if (cuisine !== "all") {
      result = result.filter((r) => r.cuisineList.includes(cuisine));
    }

    return sortRestaurants(result, pinnedIds);
  }, [restaurants, filters, cuisine, tick, pinnedIds]);

  const noFilter: Filters = { openNow: false, hasPromo: false };

  function toggleOpenNow() {
    setFilters((prev) => prev.openNow ? noFilter : { ...noFilter, openNow: true });
  }

  function toggleHasPromo() {
    setFilters((prev) => prev.hasPromo ? noFilter : { ...noFilter, hasPromo: true });
  }

  function clearFilters() {
    setFilters(noFilter);
    setCuisine("all");
  }

  const hasActiveFilter = filters.openNow || filters.hasPromo || cuisine !== "all";

  return {
    filters,
    cuisine,
    setCuisine,
    filtered,
    hasActiveFilter,
    clearFilters,
    toggleOpenNow,
    toggleHasPromo,
  };
}
