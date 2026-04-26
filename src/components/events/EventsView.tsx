import { useSwipeBarContext } from "@luciodale/swipe-bar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { lazy, Suspense, useCallback, useState } from "react";
import { importWithReload } from "../../utils/importWithReload";
import { eventCategoryLabels, eventFilterCategories } from "../../config/categories";
import type { TimeFilter } from "../../hooks/useEventFilters";
import { useEventFilters } from "../../hooks/useEventFilters";
import { useEventMapPins } from "../../hooks/useEventMapPins";
import { useRefresh } from "../../hooks/useRefresh";
import { useSpaAuth } from "../../hooks/useSpaAuth";
import { useViewMode } from "../../hooks/useViewMode";
import { useLocale } from "../../i18n/useLocale";
import type { EventWithRestaurant, SheetMeta } from "../../types/domain";
import { ContentLoader } from "../shared/ContentLoader";
import { ListHeader } from "../shared/ListHeader";
import { Pill } from "../ui/Pill";
import { EventList } from "./EventList";

const MapView = lazy(() => importWithReload(() => import("../shared/MapView")).then((m) => ({ default: m.MapView })));

type EventsViewProps = {
  events: Array<EventWithRestaurant>;
  isLoading: boolean;
};

export function EventsView({ events, isLoading }: EventsViewProps) {
  const { locale, t } = useLocale();
  const { isAdmin } = useSpaAuth();
  const queryClient = useQueryClient();
  const { mode, handleToggle } = useViewMode();
  const { isRefreshing, handleRefresh } = useRefresh([["events"], ["events-past"]]);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("tutti");

  const { data: pastData, isLoading: isPastLoading } = useQuery<{ events: Array<EventWithRestaurant> }>({
    queryKey: ["events-past"],
    queryFn: () => fetch("/api/events/past").then((r) => r.json()),
    enabled: timeFilter === "passati",
  });

  const { category, setCategory, filtered, grouped } = useEventFilters({
    events,
    pastEvents: pastData?.events ?? [],
    timeFilter,
  });
  const pins = useEventMapPins(filtered);
  const catLabels = eventCategoryLabels(locale);

  const showLoader = timeFilter === "passati" ? isPastLoading : isLoading;

  const { openSidebar } = useSwipeBarContext();

  const handlePinClick = useCallback(function handlePinClick(id: number) {
    const event = filtered.find((e) => e.id === id);
    if (!event) return;
    const meta: SheetMeta = { kind: "event", data: event };
    openSidebar("bottom", { meta });
  }, [filtered, openSidebar]);

  const handleToggleHighlight = useCallback(async function handleToggleHighlight(id: number) {
    await fetch(`/api/admin/events/${id}/highlight`, { method: "PUT" });
    queryClient.invalidateQueries({ queryKey: ["events"] });
    queryClient.invalidateQueries({ queryKey: ["events-past"] });
  }, [queryClient]);

  return (
    <div>
      <ListHeader
        title={t("events.pageTitle")}
        section="fare"
        mode={mode}
        onToggle={handleToggle}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
      >
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2" role="toolbar" aria-label={t("events.timeFilter")}>
            <Pill active={timeFilter === "tutti"} onClick={() => setTimeFilter("tutti")}>
              {t("events.all")}
            </Pill>
            <Pill active={timeFilter === "oggi"} onClick={() => setTimeFilter("oggi")}>
              {t("events.today")}
            </Pill>
            <Pill active={timeFilter === "passati"} onClick={() => setTimeFilter("passati")}>
              {t("events.past")}
            </Pill>
          </div>

          <div className="flex flex-wrap gap-2" role="toolbar" aria-label={t("events.categoryFilter")}>
            <Pill active={category === "all"} onClick={() => setCategory("all")}>
              {t("events.allCategories")}
            </Pill>
            {eventFilterCategories.map((cat) => (
              <Pill
                key={cat}
                active={category === cat}
                onClick={() => setCategory(cat)}
              >
                {catLabels[cat] ?? cat}
              </Pill>
            ))}
          </div>
        </div>
      </ListHeader>

      {showLoader ? (
        <ContentLoader />
      ) : mode === "list" ? (
        <EventList grouped={grouped} isAdmin={isAdmin} onToggleHighlight={isAdmin ? handleToggleHighlight : undefined} />
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
