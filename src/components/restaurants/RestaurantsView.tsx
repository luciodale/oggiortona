import { lazy, Suspense } from "react";
import type { RestaurantWithStatus } from "../../types/domain";
import { RestaurantList } from "./RestaurantList";
import { ViewToggle } from "../shared/ViewToggle";
import { useViewMode } from "../../hooks/useViewMode";
import { useRefresh } from "../../hooks/useRefresh";
import { useMapPins } from "../../hooks/useMapPins";
import { ContentLoader } from "../shared/ContentLoader";
import { RefreshIcon } from "../../icons/RefreshIcon";
import { useLocale } from "../../i18n/useLocale";

const MapView = lazy(() => import("../shared/MapView").then((m) => ({ default: m.MapView })));

type RestaurantsViewProps = {
  restaurants: Array<RestaurantWithStatus>;
  isLoading: boolean;
  isLoggedIn: boolean;
  initialPinnedIds: Array<number>;
};

export function RestaurantsView({ restaurants, isLoading, isLoggedIn, initialPinnedIds }: RestaurantsViewProps) {
  const { t } = useLocale();
  const { mode, handleToggle, anchorRef, mapTop } = useViewMode();
  const { isRefreshing, handleRefresh } = useRefresh([["restaurants"], ["pins"]]);
  const pins = useMapPins(restaurants);

  return (
    <div>
      <div ref={anchorRef} className="mb-3 pb-2">
        <div className="animate-fade-up flex items-center gap-3">
          <h1 className="font-family-display text-3xl font-medium tracking-tight text-primary">
            {t("restaurants.pageTitle")}
          </h1>
          <ViewToggle mode={mode} onToggle={handleToggle} />
          <button
            type="button"
            aria-label={t("common.refresh")}
            onClick={handleRefresh}
            className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border-light bg-surface text-muted transition-all duration-300 hover:border-mangiare-muted hover:text-mangiare active:scale-90"
          >
            <RefreshIcon className={`h-[18px] w-[18px]${isRefreshing ? " animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {mode === "list" ? (
        <RestaurantList restaurants={restaurants} isLoading={isLoading} isLoggedIn={isLoggedIn} initialPinnedIds={initialPinnedIds} />
      ) : isLoading ? (
        <ContentLoader />
      ) : (
        mapTop > 0 && (
          <Suspense fallback={<div className="fixed inset-x-0 bottom-0 flex items-center justify-center bg-surface-alt" style={{ top: `${mapTop}px` }}><p className="text-sm text-muted">{t("common.loadingMap")}</p></div>}>
            <div
              className="fixed inset-x-0 bottom-0"
              style={{ top: `${mapTop}px` }}
            >
              <MapView pins={pins} />
            </div>
          </Suspense>
        )
      )}
    </div>
  );
}
