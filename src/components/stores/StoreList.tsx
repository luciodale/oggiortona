import { useSwipeBarContext } from "@luciodale/swipe-bar";
import { useCallback, useRef } from "react";
import { useZipperScroll } from "../../hooks/useZipperScroll";
import type { StoreWithStatus, SheetMeta } from "../../types/domain";
import { ContentLoader } from "../shared/ContentLoader";
import { StoreCard } from "./StoreCard";

type StoreListProps = {
  filtered: Array<StoreWithStatus>;
  isLoading: boolean;
  isLoggedIn: boolean;
  pinnedIds: Set<number>;
  onTogglePin: (id: number) => void;
};

export function StoreList({ filtered, isLoading, isLoggedIn, pinnedIds, onTogglePin }: StoreListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  useZipperScroll(containerRef);
  const { openSidebar } = useSwipeBarContext();

  const handleCardClick = useCallback(function handleCardClick(store: StoreWithStatus) {
    const meta: SheetMeta = { kind: "store", data: store };
    openSidebar("bottom", { meta });
  }, [openSidebar]);

  return (
    <div ref={containerRef}>
      {isLoading ? (
        <ContentLoader />
      ) : (
        <>
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">
            {filtered.length} {filtered.length === 1 ? "negozio" : "negozi"}
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
              {filtered.map((s) => (
                <StoreCard
                  key={s.id}
                  store={s}
                  isPinned={pinnedIds.has(s.id)}
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
