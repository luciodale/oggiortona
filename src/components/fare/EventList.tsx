import { useRef } from "react";
import type { EventCategory, EventRow } from "../../types/database";
import { useEventFilters } from "../../hooks/useEventFilters";
import { useZipperScroll } from "../../hooks/useZipperScroll";
import { eventCategoryLabels, eventCategoryColors, eventCategories } from "../../config/categories";
import { ClockIcon } from "../../icons/ClockIcon";
import { MapPinIcon } from "../../icons/MapPinIcon";
import { ChevronRightIcon } from "../../icons/ChevronRightIcon";

type EventListProps = {
  events: Array<EventRow>;
};

function CategoryChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.04em] transition-all ${
        active
          ? "bg-primary text-white shadow-sm"
          : "bg-surface-warm text-muted hover:text-primary"
      }`}
    >
      {label}
    </button>
  );
}

function EventCard({ event }: { event: EventRow }) {
  const colorClass = eventCategoryColors[event.category];

  return (
    <a
      href={`/fare/${event.id}`}
      className="zipper-card group block rounded-2xl bg-white p-4 no-underline shadow-[0_1px_3px_rgba(0,0,0,0.04)] will-change-transform transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
    >
      <div className="flex items-start justify-between gap-3">
        {/* Content */}
        <div className="min-w-0 flex-1">
          <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${colorClass}`}>
            {eventCategoryLabels[event.category]}
          </span>
          <h3 className="mt-1 font-[family-name:var(--font-family-display)] text-base font-medium leading-snug text-primary">
            {event.title}
          </h3>
          {event.description && (
            <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-muted">
              {event.description}
            </p>
          )}
          <div className="mt-2 flex items-center gap-3 text-[11px] text-muted/70">
            {event.time_start && (
              <span className="flex items-center gap-1">
                <ClockIcon className="h-3 w-3" />
                {event.time_start}{event.time_end && ` \u2013 ${event.time_end}`}
              </span>
            )}
            <span className="flex items-center gap-1">
              <MapPinIcon className="h-3 w-3" />
              {event.location}
            </span>
          </div>
        </div>

        {/* Date badge — right side */}
        <div className="flex shrink-0 flex-col items-center rounded-xl bg-fare-light px-3 py-2">
          <span className="text-[10px] font-semibold uppercase text-fare/60">
            {new Date(event.date_start).toLocaleDateString("it-IT", { month: "short" })}
          </span>
          <span className="font-[family-name:var(--font-family-display)] text-2xl font-semibold leading-tight text-fare">
            {new Date(event.date_start).getDate()}
          </span>
        </div>
      </div>
    </a>
  );
}

function SectionDivider({ title }: { title: string }) {
  return (
    <h2 className="mb-3 mt-8 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted first:mt-0">
      {title}
    </h2>
  );
}

export function EventList({ events }: EventListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  useZipperScroll(containerRef);

  const { category, setCategory, grouped } = useEventFilters(events);

  return (
    <div ref={containerRef}>
      {/* Category filters */}
      <div className="scroll-hide -mx-5 flex gap-2 overflow-x-auto px-5 pb-1" role="toolbar" aria-label="Filtri categoria">
        <CategoryChip
          active={category === "all"}
          onClick={() => setCategory("all")}
          label="Tutti"
        />
        {eventCategories.map((cat) => (
          <CategoryChip
            key={cat}
            active={category === cat}
            onClick={() => setCategory(cat as EventCategory)}
            label={eventCategoryLabels[cat]}
          />
        ))}
      </div>

      {/* Grouped events */}
      {grouped.thisWeek.length === 0 && grouped.upcoming.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="font-[family-name:var(--font-family-display)] text-lg italic text-muted/50">
            Nessun evento in programma
          </p>
        </div>
      ) : (
        <div>
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
      )}
    </div>
  );
}
