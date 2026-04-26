import { useSwipeBarContext } from "@luciodale/swipe-bar";
import { lazy, Suspense, useCallback } from "react";
import type { StoreWithStatus, SheetMeta } from "../../types/domain";
import { StoreList } from "./StoreList";
import { Pill } from "../ui/Pill";
import { ListHeader } from "../shared/ListHeader";
import { useViewMode } from "../../hooks/useViewMode";
import { useRefresh } from "../../hooks/useRefresh";
import { useStoreMapPins } from "../../hooks/useMapPins";
import { useStoreFilters } from "../../hooks/useStoreFilters";
import { usePinnedStores } from "../../hooks/usePinnedStores";
import { ContentLoader } from "../shared/ContentLoader";
import { useLocale } from "../../i18n/useLocale";
import { importWithReload } from "../../utils/importWithReload";

const MapView = lazy(() => importWithReload(() => import("../shared/MapView")).then((m) => ({ default: m.MapView })));

type StoresViewProps = {
  stores: Array<StoreWithStatus>;
  isLoading: boolean;
  isLoggedIn: boolean;
  initialPinnedIds: Array<number>;
};

export function StoresView({ stores, isLoading, isLoggedIn, initialPinnedIds }: StoresViewProps) {
  const { t } = useLocale();
  const { mode, handleToggle } = useViewMode();
  const { isRefreshing, handleRefresh } = useRefresh([["stores"], ["store-pins"]]);
  const { pinnedIds, togglePin } = usePinnedStores(initialPinnedIds);
  const { filters, filtered, hasActiveFilter, clearFilters, toggleOpenNow, toggleHasPromo } =
    useStoreFilters(stores, pinnedIds);
  const pins = useStoreMapPins(filtered);

  const { openSidebar } = useSwipeBarContext();

  const handlePinClick = useCallback(function handlePinClick(id: number) {
    const store = filtered.find((s) => s.id === id);
    if (!store) return;
    const meta: SheetMeta = { kind: "store", data: store };
    openSidebar("bottom", { meta });
  }, [filtered, openSidebar]);

  const promoCount = stores.filter((s) => s.promotions.length > 0).length;

  return (
    <div>
      <ListHeader
        title={t("stores.pageTitle")}
        section="stores"
        mode={mode}
        onToggle={handleToggle}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
      >
        <div className="flex flex-wrap gap-2" role="toolbar" aria-label={t("stores.filters")}>
          <Pill active={!hasActiveFilter} onClick={clearFilters}>
            {t("events.all")}
          </Pill>
          <Pill active={filters.openNow} onClick={toggleOpenNow}>
            {t("stores.openNow")}
          </Pill>
          <Pill active={filters.hasPromo} onClick={toggleHasPromo}>
            {promoCount > 0 ? t("stores.promotionsWithCount", { count: promoCount }) : t("stores.promotions")}
          </Pill>
        </div>
      </ListHeader>

      {mode === "list" ? (
        <StoreList
          filtered={filtered}
          isLoading={isLoading}
          isLoggedIn={isLoggedIn}
          pinnedIds={pinnedIds}
          onTogglePin={togglePin}
        />
      ) : isLoading ? (
        <ContentLoader />
      ) : (
        <Suspense fallback={<div className="fixed inset-0 z-20 flex items-center justify-center bg-surface-alt"><p className="text-sm text-muted">{t("common.loadingMap")}</p></div>}>
            <div className="map-fullscreen fixed inset-0 z-20">
              <MapView pins={pins} onPinClick={handlePinClick} />
            </div>
          </Suspense>
      )}
    </div>
  );
}
