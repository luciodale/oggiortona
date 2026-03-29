import { lazy, Suspense } from "react";
import type { EventRow } from "../../types/database";
import type { Locale } from "../../types/domain";
import { EventList } from "./EventList";
import { ViewToggle } from "../shared/ViewToggle";
import { useViewMode } from "../../hooks/useViewMode";
import { useRefresh } from "../../hooks/useRefresh";
import { useEventFilters } from "../../hooks/useEventFilters";
import { useEventMapPins } from "../../hooks/useEventMapPins";
import { eventFilterCategories, eventCategoryLabels } from "../../config/categories";
import { Pill } from "../ui/Pill";
import { RefreshIcon } from "../../icons/RefreshIcon";
import { LocaleProvider, useLocale } from "../../i18n/useLocale";

const MapView = lazy(() => import("../shared/MapView").then((m) => ({ default: m.MapView })));

type EventsViewProps = {
  events: Array<EventRow>;
  locale: Locale;
};

export function EventsView({ events, locale }: EventsViewProps) {
  return (
    <LocaleProvider locale={locale}>
      <EventsViewInner events={events} />
    </LocaleProvider>
  );
}

function EventsViewInner({ events }: { events: Array<EventRow> }) {
  const { locale, t } = useLocale();
  const { mode, handleToggle, anchorRef, mapTop } = useViewMode();
  const { isRefreshing, handleRefresh } = useRefresh();
  const { timeFilter, setTimeFilter, category, setCategory, filtered, grouped } = useEventFilters(events);
  const pins = useEventMapPins(filtered);
  const catLabels = eventCategoryLabels(locale);

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
          <div className="scroll-hide -mx-5 flex gap-2 overflow-x-auto px-5" role="toolbar" aria-label={t("events.timeFilter")}>
            <Pill active={timeFilter === "tutti"} onClick={() => setTimeFilter("tutti")}>
              {t("events.all")}
            </Pill>
            <Pill active={timeFilter === "oggi"} onClick={() => setTimeFilter("oggi")}>
              {t("events.today")}
            </Pill>
          </div>

          <div className="scroll-hide -mx-5 flex gap-2 overflow-x-auto px-5" role="toolbar" aria-label={t("events.categoryFilter")}>
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

      {mode === "list" ? (
        <EventList grouped={grouped} />
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
