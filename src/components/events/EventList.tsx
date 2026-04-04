import { useSwipeBarContext } from "@luciodale/swipe-bar";
import { useCallback, useRef } from "react";
import { useZipperScroll } from "../../hooks/useZipperScroll";
import { useLocale } from "../../i18n/useLocale";
import type { EventWithRestaurant, SheetMeta } from "../../types/domain";
import { isToday } from "../../utils/date";
import { EventCard, SectionDivider } from "./EventCard";

type EventGroups = {
  thisWeek: Array<EventWithRestaurant>;
  upcoming: Array<EventWithRestaurant>;
  past: Array<EventWithRestaurant>;
};

type EventListProps = {
  grouped: EventGroups;
  isAdmin?: boolean;
  onToggleHighlight?: (id: number) => void;
};

function getEventPriority(event: EventWithRestaurant): number {
  if (event.highlighted === 1) return 0;
  const hasRestaurant = event.restaurantId != null;
  const isTodayEvent = isToday(event.dateStart, event.dateEnd);
  if (hasRestaurant && isTodayEvent) return 1;
  if (isTodayEvent) return 2;
  if (hasRestaurant) return 3;
  return 4;
}

function sortByPriority(events: Array<EventWithRestaurant>): Array<EventWithRestaurant> {
  return [...events].sort((a, b) => {
    const pa = getEventPriority(a);
    const pb = getEventPriority(b);
    if (pa !== pb) return pa - pb;
    if (a.dateStart !== b.dateStart) return a.dateStart < b.dateStart ? -1 : 1;
    return (a.timeStart ?? "") < (b.timeStart ?? "") ? -1 : 1;
  });
}

export function EventList({ grouped, isAdmin, onToggleHighlight }: EventListProps) {
  const { t } = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);
  useZipperScroll(containerRef);
  const { openSidebar } = useSwipeBarContext();

  const handleCardClick = useCallback(function handleCardClick(event: EventWithRestaurant) {
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
                {sortByPriority(grouped.thisWeek).map((e) => (
                  <EventCard key={e.id} event={e} onCardClick={handleCardClick} isAdmin={isAdmin} onToggleHighlight={onToggleHighlight} />
                ))}
              </div>
            </>
          )}
          {grouped.upcoming.length > 0 && (
            <>
              <SectionDivider title={t("events.upcoming")} />
              <div className="flex flex-col gap-3">
                {sortByPriority(grouped.upcoming).map((e) => (
                  <EventCard key={e.id} event={e} onCardClick={handleCardClick} isAdmin={isAdmin} onToggleHighlight={onToggleHighlight} />
                ))}
              </div>
            </>
          )}
          {grouped.past.length > 0 && (
            <>
              <SectionDivider title={t("events.past")} />
              <div className="flex flex-col gap-3">
                {grouped.past.map((e) => (
                  <EventCard key={e.id} event={e} onCardClick={handleCardClick} isPast />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
