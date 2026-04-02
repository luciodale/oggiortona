import { lazy, Suspense } from "react";
import type { RestaurantWithStatus } from "../../types/domain";
import { RestaurantList } from "./RestaurantList";
import { ViewToggle } from "../shared/ViewToggle";
import { Pill } from "../ui/Pill";
import { useViewMode } from "../../hooks/useViewMode";
import { useRefresh } from "../../hooks/useRefresh";
import { useMapPins } from "../../hooks/useMapPins";
import { useRestaurantFilters } from "../../hooks/useRestaurantFilters";
import { usePinnedRestaurants } from "../../hooks/usePinnedRestaurants";
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
  const { mode, handleToggle } = useViewMode();
  const { isRefreshing, handleRefresh } = useRefresh([["restaurants"], ["pins"]]);
  const { pinnedIds, togglePin } = usePinnedRestaurants(initialPinnedIds);
  const { filters, filtered, hasActiveFilter, clearFilters, toggleOpenNow, toggleHasPromo, toggleHasNews } =
    useRestaurantFilters(restaurants, pinnedIds);
  const pins = useMapPins(filtered);

  const promoCount = restaurants.filter((r) => r.promotions.some((p) => p.type === "special" || p.type === "deal")).length;
  const newsCount = restaurants.filter((r) => r.promotions.some((p) => p.type === "news")).length;

  return (
    <div>
      <div className={`space-y-3 pb-3${mode === "map" ? " relative z-30" : ""}`}>
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

        <div className="flex flex-wrap gap-2" role="toolbar" aria-label="Filtri">
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
      </div>

      {mode === "list" ? (
        <RestaurantList
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
              <MapView pins={pins} />
            </div>
          </Suspense>
      )}
    </div>
  );
}
