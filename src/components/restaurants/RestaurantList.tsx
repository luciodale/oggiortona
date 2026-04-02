import { useSwipeBarContext } from "@luciodale/swipe-bar";
import { useCallback, useRef } from "react";
import { useZipperScroll } from "../../hooks/useZipperScroll";
import type { RestaurantWithStatus } from "../../types/domain";
import type { SheetMeta } from "../../types/domain";
import { ContentLoader } from "../shared/ContentLoader";
import { RestaurantCard } from "./RestaurantCard";

type RestaurantListProps = {
  filtered: Array<RestaurantWithStatus>;
  isLoading: boolean;
  isLoggedIn: boolean;
  pinnedIds: Set<number>;
  onTogglePin: (id: number) => void;
};

export function RestaurantList({ filtered, isLoading, isLoggedIn, pinnedIds, onTogglePin }: RestaurantListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  useZipperScroll(containerRef);
  const { openSidebar } = useSwipeBarContext();

  const handleCardClick = useCallback(function handleCardClick(restaurant: RestaurantWithStatus) {
    const meta: SheetMeta = { kind: "restaurant", data: restaurant };
    openSidebar("bottom", { meta });
  }, [openSidebar]);

  return (
    <div ref={containerRef}>
      {isLoading ? (
        <ContentLoader />
      ) : (
        <>
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.1em] text-muted">
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
                  onTogglePin={isLoggedIn ? onTogglePin : undefined}
                  onCardClick={handleCardClick}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
