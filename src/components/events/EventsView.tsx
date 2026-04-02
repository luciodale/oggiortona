import { lazy, Suspense, useState, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { EventRow } from "../../types/database";
import { EventList } from "./EventList";
import { ViewToggle } from "../shared/ViewToggle";
import { useViewMode } from "../../hooks/useViewMode";
import { useRefresh } from "../../hooks/useRefresh";
import { useEventFilters } from "../../hooks/useEventFilters";
import type { TimeFilter } from "../../hooks/useEventFilters";
import { useEventMapPins } from "../../hooks/useEventMapPins";
import { eventFilterCategories, eventCategoryLabels } from "../../config/categories";
import { ContentLoader } from "../shared/ContentLoader";
import { Pill } from "../ui/Pill";
import { RefreshIcon } from "../../icons/RefreshIcon";
import { useLocale } from "../../i18n/useLocale";
import { useSpaAuth } from "../../hooks/useSpaAuth";

const MapView = lazy(() => import("../shared/MapView").then((m) => ({ default: m.MapView })));

type EventsViewProps = {
  events: Array<EventRow>;
  isLoading: boolean;
};

export function EventsView({ events, isLoading }: EventsViewProps) {
  const { locale, t } = useLocale();
  const { isAdmin } = useSpaAuth();
  const queryClient = useQueryClient();
  const { mode, handleToggle, anchorRef, mapTop } = useViewMode();
  const { isRefreshing, handleRefresh } = useRefresh([["events"], ["events-past"]]);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("tutti");

  const { data: pastData, isLoading: isPastLoading } = useQuery<{ events: Array<EventRow> }>({
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

  const handleToggleHighlight = useCallback(async function handleToggleHighlight(id: number) {
    await fetch(`/api/admin/events/${id}/highlight`, { method: "PUT" });
    queryClient.invalidateQueries({ queryKey: ["events"] });
    queryClient.invalidateQueries({ queryKey: ["events-past"] });
  }, [queryClient]);

  return (
    <div>
      <div ref={anchorRef} className="space-y-3 pb-3">
        <div className="animate-fade-up flex items-center gap-3">
          <h1 className="font-family-display text-3xl font-medium tracking-tight text-primary">
            {t("events.pageTitle")}
          </h1>
          <ViewToggle mode={mode} onToggle={handleToggle} />
          <button
            type="button"
            aria-label={t("common.refresh")}
            onClick={handleRefresh}
            className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border-light bg-surface text-muted transition-all duration-300 hover:border-fare-muted hover:text-fare active:scale-90"
          >
            <RefreshIcon className={`h-[18px] w-[18px]${isRefreshing ? " animate-spin" : ""}`} />
          </button>
        </div>

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
      </div>

      {showLoader ? (
        <ContentLoader />
      ) : mode === "list" ? (
        <EventList grouped={grouped} isAdmin={isAdmin} onToggleHighlight={isAdmin ? handleToggleHighlight : undefined} />
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
