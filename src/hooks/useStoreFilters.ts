import { useState, useMemo, useEffect } from "react";
import type { StoreWithStatus } from "../types/domain";
import { isOpenNow } from "../utils/time";
import { getTodayISO } from "../utils/date";
import { sortStores } from "../utils/sortStores";

type Filters = {
  openNow: boolean;
  hasPromo: boolean;
};

export function useStoreFilters(stores: Array<StoreWithStatus>, pinnedIds: Set<number>) {
  const [filters, setFilters] = useState<Filters>({
    openNow: false,
    hasPromo: false,
  });

  const [tick, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(interval);
  }, []);

  const filtered = useMemo(() => {
    const today = getTodayISO();

    let result = stores.map((s) => {
      const activePromotions = s.promotions.filter((p) => p.dateEnd >= today);

      return {
        ...s,
        isOpen: isOpenNow(s.parsedHours),
        promotions: activePromotions,
      };
    });

    if (filters.openNow) {
      result = result.filter((s) => s.isOpen);
    }
    if (filters.hasPromo) {
      result = result.filter((s) => s.promotions.length > 0);
    }

    return sortStores(result, pinnedIds);
  }, [stores, filters, tick, pinnedIds]);

  const noFilter: Filters = { openNow: false, hasPromo: false };

  function toggleOpenNow() {
    setFilters((prev) => prev.openNow ? noFilter : { ...noFilter, openNow: true });
  }

  function toggleHasPromo() {
    setFilters((prev) => prev.hasPromo ? noFilter : { ...noFilter, hasPromo: true });
  }

  function clearFilters() {
    setFilters(noFilter);
  }

  const hasActiveFilter = filters.openNow || filters.hasPromo;

  return {
    filters,
    filtered,
    hasActiveFilter,
    clearFilters,
    toggleOpenNow,
    toggleHasPromo,
  };
}
