import { lazy, Suspense } from "react";
import type { RestaurantWithStatus } from "../../types/domain";
import { RestaurantList } from "./RestaurantList";
import { ViewToggle } from "../shared/ViewToggle";
import { useViewMode } from "../../hooks/useViewMode";
import { useMapPins } from "../../hooks/useMapPins";

const MapView = lazy(() => import("../shared/MapView").then((m) => ({ default: m.MapView })));

type RestaurantsViewProps = {
  restaurants: Array<RestaurantWithStatus>;
};

export function RestaurantsView({ restaurants }: RestaurantsViewProps) {
  const { mode, handleToggle, anchorRef, mapTop } = useViewMode();
  const pins = useMapPins(restaurants);

  return (
    <div>
      <div ref={anchorRef} className="mb-6 pb-2">
        <ViewToggle mode={mode} onToggle={handleToggle} />
      </div>

      {mode === "list" ? (
        <RestaurantList restaurants={restaurants} />
      ) : (
        mapTop > 0 && (
          <Suspense fallback={<div className="fixed inset-x-0 bottom-0 flex items-center justify-center bg-surface-alt" style={{ top: `${mapTop}px` }}><p className="text-sm text-muted">Caricamento mappa...</p></div>}>
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
