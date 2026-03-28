import { useState, useMemo, useEffect } from "react";
import type { RestaurantWithStatus } from "../types/domain";
import { isOpenNow, isUtcDatetimeInFuture } from "../utils/time";

type Filters = {
  openNow: boolean;
  hasSpecial: boolean;
  hasDeals: boolean;
};

export function useRestaurantFilters(restaurants: Array<RestaurantWithStatus>) {
  const [filters, setFilters] = useState<Filters>({
    openNow: false,
    hasSpecial: false,
    hasDeals: false,
  });

  // Tick every 60s to re-evaluate open status and deal expiry
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(interval);
  }, []);

  const filtered = useMemo(() => {
    let result = restaurants.map((r) => {
      // Re-evaluate deal validity on the client
      const dealStillActive =
        r.active_deal && isUtcDatetimeInFuture(r.active_deal.valid_until);

      return {
        ...r,
        is_open: isOpenNow(r.parsed_hours),
        active_deal: dealStillActive ? r.active_deal : null,
      };
    });

    if (filters.openNow) {
      result = result.filter((r) => r.is_open);
    }
    if (filters.hasSpecial) {
      result = result.filter((r) => r.today_special !== null);
    }
    if (filters.hasDeals) {
      result = result.filter((r) => r.active_deal !== null);
    }

    result.sort((a, b) => {
      // Tier 1: active deal (soonest expiry first)
      const aDeal = a.active_deal ? 1 : 0;
      const bDeal = b.active_deal ? 1 : 0;
      if (aDeal !== bDeal) return bDeal - aDeal;
      if (a.active_deal && b.active_deal) {
        const aExpiry = new Date(a.active_deal.valid_until + "Z").getTime();
        const bExpiry = new Date(b.active_deal.valid_until + "Z").getTime();
        return aExpiry - bExpiry;
      }

      // Tier 2: has daily special
      const aSpecial = a.today_special ? 1 : 0;
      const bSpecial = b.today_special ? 1 : 0;
      if (aSpecial !== bSpecial) return bSpecial - aSpecial;

      // Tier 3: currently open
      const aOpen = a.is_open ? 1 : 0;
      const bOpen = b.is_open ? 1 : 0;
      if (aOpen !== bOpen) return bOpen - aOpen;

      // Tier 4: alphabetical
      return a.name.localeCompare(b.name, "it");
    });

    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurants, filters, tick]);

  const noFilter: Filters = { openNow: false, hasSpecial: false, hasDeals: false };

  function toggleOpenNow() {
    setFilters((prev) => prev.openNow ? noFilter : { ...noFilter, openNow: true });
  }

  function toggleHasSpecial() {
    setFilters((prev) => prev.hasSpecial ? noFilter : { ...noFilter, hasSpecial: true });
  }

  function toggleHasDeals() {
    setFilters((prev) => prev.hasDeals ? noFilter : { ...noFilter, hasDeals: true });
  }

  return {
    filters,
    filtered,
    toggleOpenNow,
    toggleHasSpecial,
    toggleHasDeals,
  };
}
