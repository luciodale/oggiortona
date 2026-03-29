import { useRef } from "react";
import { useZipperScroll } from "../../hooks/useZipperScroll";
import type { EventRow } from "../../types/database";
import { EventCard, SectionDivider } from "./EventCard";

type EventGroups = {
  thisWeek: Array<EventRow>;
  upcoming: Array<EventRow>;
};

type EventListProps = {
  grouped: EventGroups;
};

export function EventList({ grouped }: EventListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  useZipperScroll(containerRef);

  if (grouped.thisWeek.length === 0 && grouped.upcoming.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="font-family-display text-lg italic text-muted/50">
          Nessun evento in programma
        </p>
      </div>
    );
  }

  return (
    <div ref={containerRef} role="region" aria-label="Lista eventi">
      {grouped.thisWeek.length > 0 && (
        <>
          <SectionDivider title="Questa settimana" />
          <div className="flex flex-col gap-3">
            {grouped.thisWeek.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        </>
      )}
      {grouped.upcoming.length > 0 && (
        <>
          <SectionDivider title="Prossimamente" />
          <div className="flex flex-col gap-3">
            {grouped.upcoming.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
