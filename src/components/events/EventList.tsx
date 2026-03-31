import { useSwipeBarContext } from "@luciodale/swipe-bar";
import { useCallback, useRef } from "react";
import { useZipperScroll } from "../../hooks/useZipperScroll";
import { useLocale } from "../../i18n/useLocale";
import type { EventRow } from "../../types/database";
import type { SheetMeta } from "../../types/domain";
import { EventCard, SectionDivider } from "./EventCard";

type EventGroups = {
  thisWeek: Array<EventRow>;
  upcoming: Array<EventRow>;
  past: Array<EventRow>;
};

type EventListProps = {
  grouped: EventGroups;
};

export function EventList({ grouped }: EventListProps) {
  const { t } = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);
  useZipperScroll(containerRef);
  const { openSidebar } = useSwipeBarContext();

  const handleCardClick = useCallback(function handleCardClick(event: EventRow) {
    const meta: SheetMeta = { kind: "event", data: event };
    openSidebar("bottom", { meta });
  }, [openSidebar]);

  const isEmpty = grouped.thisWeek.length === 0 && grouped.upcoming.length === 0 && grouped.past.length === 0;

  return (
    <div ref={containerRef} role="region" aria-label="Lista eventi">
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="font-family-display text-lg italic text-muted/50">
            {t("events.noEvents")}
          </p>
        </div>
      ) : (
        <>
          {grouped.thisWeek.length > 0 && (
            <>
              <SectionDivider title={t("events.thisWeek")} />
              <div className="flex flex-col gap-3">
                {grouped.thisWeek.map((e) => (
                  <EventCard key={e.id} event={e} onCardClick={handleCardClick} />
                ))}
              </div>
            </>
          )}
          {grouped.upcoming.length > 0 && (
            <>
              <SectionDivider title={t("events.upcoming")} />
              <div className="flex flex-col gap-3">
                {grouped.upcoming.map((e) => (
                  <EventCard key={e.id} event={e} onCardClick={handleCardClick} />
                ))}
              </div>
            </>
          )}
          {grouped.past.length > 0 && (
            <>
              <SectionDivider title={t("events.past")} />
              <div className="flex flex-col gap-3">
                {grouped.past.map((e) => (
                  <EventCard key={e.id} event={e} onCardClick={handleCardClick} />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
