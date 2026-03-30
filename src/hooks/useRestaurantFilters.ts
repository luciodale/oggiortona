import { useState, useMemo, useEffect } from "react";
import type { RestaurantWithStatus } from "../types/domain";
import { isOpenNow } from "../utils/time";
import { getTodayISO } from "../utils/date";

type Filters = {
  openNow: boolean;
  hasPromo: boolean;
  hasNews: boolean;
};

export function useRestaurantFilters(restaurants: Array<RestaurantWithStatus>, pinnedIds: Set<number>) {
  const [filters, setFilters] = useState<Filters>({
    openNow: false,
    hasPromo: false,
    hasNews: false,
  });

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
      result = result.filter((r) => r.promotions.some((p) => p.type === "special" || p.type === "deal"));
    }
    if (filters.hasNews) {
      result = result.filter((r) => r.promotions.some((p) => p.type === "news"));
    }

    result.sort((a, b) => {
      // Tier 0: pinned restaurants first
      const aPinned = pinnedIds.has(a.id) ? 1 : 0;
      const bPinned = pinnedIds.has(b.id) ? 1 : 0;
      if (aPinned !== bPinned) return bPinned - aPinned;

      // Tier 1: active deal (soonest expiry first)
      const aDeals = a.promotions.filter((p) => p.type === "deal");
      const bDeals = b.promotions.filter((p) => p.type === "deal");
      const aDeal = aDeals.length > 0 ? 1 : 0;
      const bDeal = bDeals.length > 0 ? 1 : 0;
      if (aDeal !== bDeal) return bDeal - aDeal;
      const aFirstDeal = aDeals[0];
      const bFirstDeal = bDeals[0];
      if (aFirstDeal && bFirstDeal) {
        return aFirstDeal.dateEnd.localeCompare(bFirstDeal.dateEnd);
      }

      // Tier 2: has daily special
      const aSpecial = a.promotions.some((p) => p.type === "special") ? 1 : 0;
      const bSpecial = b.promotions.some((p) => p.type === "special") ? 1 : 0;
      if (aSpecial !== bSpecial) return bSpecial - aSpecial;

      // Tier 3: currently open
      const aOpen = a.isOpen ? 1 : 0;
      const bOpen = b.isOpen ? 1 : 0;
      if (aOpen !== bOpen) return bOpen - aOpen;

      // Tier 4: alphabetical
      return a.name.localeCompare(b.name, "it");
    });

    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurants, filters, tick, pinnedIds]);

  const noFilter: Filters = { openNow: false, hasPromo: false, hasNews: false };

  function toggleOpenNow() {
    setFilters((prev) => prev.openNow ? noFilter : { ...noFilter, openNow: true });
  }

  function toggleHasPromo() {
    setFilters((prev) => prev.hasPromo ? noFilter : { ...noFilter, hasPromo: true });
  }

  function toggleHasNews() {
    setFilters((prev) => prev.hasNews ? noFilter : { ...noFilter, hasNews: true });
  }

  function clearFilters() {
    setFilters(noFilter);
  }

  const hasActiveFilter = filters.openNow || filters.hasPromo || filters.hasNews;

  return {
    filters,
    filtered,
    hasActiveFilter,
    clearFilters,
    toggleOpenNow,
    toggleHasPromo,
    toggleHasNews,
  };
}
