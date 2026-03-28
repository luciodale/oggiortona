import { useRef } from "react";
import type { RestaurantWithStatus } from "../../types/domain";
import { useRestaurantFilters } from "../../hooks/useRestaurantFilters";
import { useZipperScroll } from "../../hooks/useZipperScroll";
import { RestaurantCard } from "./RestaurantCard";
import { Pill } from "../ui/Pill";

type RestaurantListProps = {
  restaurants: Array<RestaurantWithStatus>;
};

export function RestaurantList({ restaurants }: RestaurantListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  useZipperScroll(containerRef);

  const { filters, filtered, toggleOpenNow, toggleHasSpecial, toggleHasDeals } =
    useRestaurantFilters(restaurants);

  const specialCount = restaurants.filter((r) => r.promotions.some((p) => p.type === "special")).length;
  const dealCount = restaurants.filter((r) => r.promotions.some((p) => p.type === "deal")).length;

  return (
    <div ref={containerRef}>
      <div className="scroll-hide -mx-5 flex gap-2 overflow-x-auto px-5 pb-1" role="toolbar" aria-label="Filtri">
        <Pill active={filters.openNow} onClick={toggleOpenNow}>
          Aperto ora
        </Pill>
        <Pill active={filters.hasSpecial} onClick={toggleHasSpecial}>
          {specialCount > 0 ? `Piatto del giorno (${specialCount})` : "Piatto del giorno"}
        </Pill>
        <Pill active={filters.hasDeals} onClick={toggleHasDeals}>
          {dealCount > 0 ? `Offerte (${dealCount})` : "Offerte"}
        </Pill>
      </div>

      <p className="mb-4 mt-5 text-[11px] font-medium uppercase tracking-[0.1em] text-muted">
        {filtered.length} {filtered.length === 1 ? "locale" : "locali"}
      </p>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="font-[family-name:var(--font-family-display)] text-lg italic text-muted/50">
            Nessun risultato
          </p>
          <p className="mt-1 text-xs text-muted/40">Prova a cambiare i filtri</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      )}
    </div>
  );
}
