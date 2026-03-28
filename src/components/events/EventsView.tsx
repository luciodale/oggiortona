import { lazy, Suspense } from "react";
import type { EventRow } from "../../types/database";
import { EventList } from "./EventList";
import { ViewToggle } from "../shared/ViewToggle";
import { useViewMode } from "../../hooks/useViewMode";
import { useEventFilters } from "../../hooks/useEventFilters";
import { useEventMapPins } from "../../hooks/useEventMapPins";
import { eventFilterCategories, eventCategoryLabels } from "../../config/categories";
import { Pill } from "../ui/Pill";

const MapView = lazy(() => import("../shared/MapView").then((m) => ({ default: m.MapView })));

type EventsViewProps = {
  events: Array<EventRow>;
};

export function EventsView({ events }: EventsViewProps) {
  const { mode, handleToggle, anchorRef, mapTop } = useViewMode();
  const { timeFilter, setTimeFilter, category, setCategory, filtered, grouped } = useEventFilters(events);
  const pins = useEventMapPins(filtered);

  return (
    <div>
      <div ref={anchorRef} className="space-y-3 pb-2">
        <ViewToggle mode={mode} onToggle={handleToggle} />

        <div className="space-y-2">
          <div className="scroll-hide -mx-5 flex gap-2 overflow-x-auto px-5" role="toolbar" aria-label="Filtro temporale">
            <Pill active={timeFilter === "tutti"} onClick={() => setTimeFilter("tutti")}>
              Tutti
            </Pill>
            <Pill active={timeFilter === "oggi"} onClick={() => setTimeFilter("oggi")}>
              Oggi
            </Pill>
          </div>

          <div className="scroll-hide -mx-5 flex gap-2 overflow-x-auto px-5" role="toolbar" aria-label="Filtri categoria">
            <Pill active={category === "all"} onClick={() => setCategory("all")}>
              Tutte
            </Pill>
            {eventFilterCategories.map((cat) => (
              <Pill
                key={cat}
                active={category === cat}
                onClick={() => setCategory(cat)}
              >
                {eventCategoryLabels[cat] ?? cat}
              </Pill>
            ))}
          </div>
        </div>
      </div>

      {mode === "list" ? (
        <EventList grouped={grouped} />
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
