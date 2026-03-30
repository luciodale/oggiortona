import { useRef } from "react";
import { usePinnedRestaurants } from "../../hooks/usePinnedRestaurants";
import { useRestaurantFilters } from "../../hooks/useRestaurantFilters";
import { useZipperScroll } from "../../hooks/useZipperScroll";
import type { RestaurantWithStatus } from "../../types/domain";
import { ContentLoader } from "../shared/ContentLoader";
import { Pill } from "../ui/Pill";
import { RestaurantCard } from "./RestaurantCard";

type RestaurantListProps = {
  restaurants: Array<RestaurantWithStatus>;
  isLoading: boolean;
  isLoggedIn: boolean;
  initialPinnedIds: Array<number>;
};

export function RestaurantList({ restaurants, isLoading, isLoggedIn, initialPinnedIds }: RestaurantListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  useZipperScroll(containerRef);
  const { pinnedIds, togglePin } = usePinnedRestaurants(initialPinnedIds);

  const { filters, filtered, hasActiveFilter, clearFilters, toggleOpenNow, toggleHasPromo, toggleHasNews } =
    useRestaurantFilters(restaurants, pinnedIds);

  const promoCount = restaurants.filter((r) => r.promotions.some((p) => p.type === "special" || p.type === "deal")).length;
  const newsCount = restaurants.filter((r) => r.promotions.some((p) => p.type === "news")).length;

  return (
    <div ref={containerRef}>
      <div className="flex flex-wrap gap-2 pb-1" role="toolbar" aria-label="Filtri">
        <Pill active={!hasActiveFilter} onClick={clearFilters}>
          Tutti
        </Pill>
        <Pill active={filters.openNow} onClick={toggleOpenNow}>
          Aperto ora
        </Pill>
        <Pill active={filters.hasPromo} onClick={toggleHasPromo}>
          {promoCount > 0 ? `Promozioni (${promoCount})` : "Promozioni"}
        </Pill>
        <Pill active={filters.hasNews} onClick={toggleHasNews}>
          {newsCount > 0 ? `News (${newsCount})` : "News"}
        </Pill>
      </div>

      {isLoading ? (
        <ContentLoader />
      ) : (
        <>
          <p className="mb-3 mt-3 text-[11px] font-medium uppercase tracking-[0.1em] text-muted">
            {filtered.length} {filtered.length === 1 ? "locale" : "locali"}
          </p>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="font-family-display text-lg italic text-muted/50">
                Nessun risultato
              </p>
              <p className="mt-1 text-xs text-muted/40">Prova a cambiare i filtri</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filtered.map((r) => (
                <RestaurantCard
                  key={r.id}
                  restaurant={r}
                  isPinned={pinnedIds.has(r.id)}
                  onTogglePin={isLoggedIn ? togglePin : undefined}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
