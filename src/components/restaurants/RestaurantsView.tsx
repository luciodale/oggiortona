import { useSwipeBarContext } from "@luciodale/swipe-bar";
import { lazy, Suspense, useCallback } from "react";
import type { RestaurantWithStatus, SheetMeta } from "../../types/domain";
import { RestaurantList } from "./RestaurantList";
import { Pill } from "../ui/Pill";
import { ListHeader } from "../shared/ListHeader";
import { useViewMode } from "../../hooks/useViewMode";
import { useRefresh } from "../../hooks/useRefresh";
import { useMapPins } from "../../hooks/useMapPins";
import { useRestaurantFilters } from "../../hooks/useRestaurantFilters";
import { usePinnedRestaurants } from "../../hooks/usePinnedRestaurants";
import { ContentLoader } from "../shared/ContentLoader";
import { useLocale } from "../../i18n/useLocale";
import { restaurantCuisines, restaurantCuisineLabels } from "../../config/cuisines";
import { importWithReload } from "../../utils/importWithReload";

const MapView = lazy(() => importWithReload(() => import("../shared/MapView")).then((m) => ({ default: m.MapView })));

type RestaurantsViewProps = {
  restaurants: Array<RestaurantWithStatus>;
  isLoading: boolean;
  isLoggedIn: boolean;
  initialPinnedIds: Array<number>;
};

export function RestaurantsView({ restaurants, isLoading, isLoggedIn, initialPinnedIds }: RestaurantsViewProps) {
  const { locale, t } = useLocale();
  const { mode, handleToggle } = useViewMode();
  const { isRefreshing, handleRefresh } = useRefresh([["restaurants"], ["pins"]]);
  const { pinnedIds, togglePin } = usePinnedRestaurants(initialPinnedIds);
  const { filters, cuisine, setCuisine, filtered, hasActiveFilter, clearFilters, toggleOpenNow, toggleHasPromo } =
    useRestaurantFilters(restaurants, pinnedIds);
  const pins = useMapPins(filtered);
  const cuisineLabels = restaurantCuisineLabels(locale);

  const { openSidebar } = useSwipeBarContext();

  const handlePinClick = useCallback(function handlePinClick(id: number) {
    const restaurant = filtered.find((r) => r.id === id);
    if (!restaurant) return;
    const meta: SheetMeta = { kind: "restaurant", data: restaurant };
    openSidebar("bottom", { meta });
  }, [filtered, openSidebar]);

  const promoCount = restaurants.filter((r) => r.promotions.length > 0).length;

  return (
    <div>
      <ListHeader
        title={t("restaurants.pageTitle")}
        section="mangiare"
        mode={mode}
        onToggle={handleToggle}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
      >
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2" role="toolbar" aria-label={t("restaurants.filters")}>
            <Pill active={!hasActiveFilter} onClick={clearFilters}>
              {t("events.all")}
            </Pill>
            <Pill active={filters.openNow} onClick={toggleOpenNow}>
              {t("restaurants.openNow")}
            </Pill>
            <Pill active={filters.hasPromo} onClick={toggleHasPromo}>
              {promoCount > 0 ? t("restaurants.promotionsWithCount", { count: promoCount }) : t("restaurants.promotions")}
            </Pill>
          </div>

          <div
            className="flex flex-nowrap gap-2 overflow-x-auto scroll-hide pr-20"
            role="toolbar"
            aria-label={t("restaurants.cuisineFilter")}
            style={{
              maskImage: "linear-gradient(to right, black 0, black calc(100% - 80px), transparent 100%)",
              WebkitMaskImage: "linear-gradient(to right, black 0, black calc(100% - 80px), transparent 100%)",
            }}
          >
            <Pill active={cuisine === "all"} onClick={() => setCuisine("all")}>
              {t("restaurants.allCuisines")}
            </Pill>
            {restaurantCuisines.map((c) => (
              <Pill
                key={c}
                active={cuisine === c}
                onClick={() => setCuisine(c)}
              >
                {cuisineLabels[c] ?? c}
              </Pill>
            ))}
          </div>
        </div>
      </ListHeader>

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
              <MapView pins={pins} onPinClick={handlePinClick} />
            </div>
          </Suspense>
      )}
    </div>
  );
}
