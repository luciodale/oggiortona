import { useState, useRef, useEffect, lazy, Suspense } from "react";
import type { RestaurantWithStatus } from "../../types/domain";
import { RestaurantList } from "./RestaurantList";
import { restaurantTypeLabels } from "../../config/categories";
import { formatUtcAsItalianTime } from "../../utils/time";

const MapView = lazy(() => import("../shared/MapView").then((m) => ({ default: m.MapView })));

type MangiareViewProps = {
  restaurants: Array<RestaurantWithStatus>;
};

type ViewMode = "list" | "map";

function getInitialMode(): ViewMode {
  if (typeof window === "undefined") return "list";
  const params = new URLSearchParams(window.location.search);
  return params.get("vista") === "mappa" ? "map" : "list";
}

function ViewToggle({ mode, onToggle }: { mode: ViewMode; onToggle: (m: ViewMode) => void }) {
  return (
    <div className="flex rounded-xl bg-surface-warm p-0.5" role="tablist" aria-label="Vista">
      <button
        type="button"
        role="tab"
        aria-selected={mode === "list"}
        onClick={() => onToggle("list")}
        className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-[11px] font-semibold uppercase tracking-[0.06em] transition-all ${
          mode === "list" ? "bg-white text-primary shadow-sm" : "text-muted"
        }`}
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
        Lista
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={mode === "map"}
        onClick={() => onToggle("map")}
        className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-[11px] font-semibold uppercase tracking-[0.06em] transition-all ${
          mode === "map" ? "bg-white text-primary shadow-sm" : "text-muted"
        }`}
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
          <line x1="8" y1="2" x2="8" y2="18" />
          <line x1="16" y1="6" x2="16" y2="22" />
        </svg>
        Mappa
      </button>
    </div>
  );
}

export function MangiareView({ restaurants }: MangiareViewProps) {
  const [mode, setMode] = useState<ViewMode>(getInitialMode);
  const anchorRef = useRef<HTMLDivElement>(null);
  const [mapTop, setMapTop] = useState(0);

  function handleToggle(next: ViewMode) {
    setMode(next);
    const url = new URL(window.location.href);
    if (next === "map") {
      url.searchParams.set("vista", "mappa");
    } else {
      url.searchParams.delete("vista");
    }
    window.history.replaceState({}, "", url.toString());
  }

  useEffect(() => {
    if (mode !== "map" || !anchorRef.current) return;

    function measure() {
      if (!anchorRef.current) return;
      const rect = anchorRef.current.getBoundingClientRect();
      setMapTop(rect.bottom);
    }

    measure();
    window.addEventListener("resize", measure, { passive: true });
    return () => window.removeEventListener("resize", measure);
  }, [mode]);

  const pins = restaurants
    .filter((r) => r.latitude != null && r.longitude != null)
    .map((r) => ({
      id: r.id,
      lat: r.latitude!,
      lng: r.longitude!,
      label: r.name,
      subtitle: r.types.map((t) => restaurantTypeLabels[t] ?? t).join(" · "),
      href: `/mangiare/${r.id}`,
      directionsUrl: r.google_maps_url ?? undefined,
      color: r.is_open ? "#c4512a" : "#8c7e6f",
      variant: "restaurant" as const,
      isOpen: r.is_open,
      priceRange: r.price_range,
      special: r.today_special
        ? { description: r.today_special.description, price: r.today_special.price }
        : null,
      deal: r.active_deal
        ? {
            title: r.active_deal.title,
            description: r.active_deal.description,
            validUntil: formatUtcAsItalianTime(r.active_deal.valid_until),
          }
        : null,
    }));

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
