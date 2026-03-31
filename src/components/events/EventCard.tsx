import { eventCategoryColors, eventCategoryLabels } from "../../config/categories";
import { useLocale } from "../../i18n/useLocale";
import { ClockIcon } from "../../icons/ClockIcon";
import type { EventRow } from "../../types/database";
import { CardContactButtons } from "../shared/CardContactButtons";
import { EventLink } from "./EventLink";
import { EventPriceBadge } from "./EventPriceBadge";

type EventCardProps = {
  event: EventRow;
  zipperCard?: boolean;
  onCardClick?: (event: EventRow) => void;
};

export function EventCard({ event, zipperCard = true, onCardClick }: EventCardProps) {
  const { locale } = useLocale();
  const labels = eventCategoryLabels(locale);
  const categories = event.category.split(",").map((c) => c.trim());

  function handleClick(e: React.MouseEvent) {
    if (onCardClick) {
      e.preventDefault();
      onCardClick(event);
    }
  }

  return (
    <div
      className={`${zipperCard ? "zipper-card" : ""} rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] ${onCardClick ? "cursor-pointer" : ""}`}
      onClick={handleClick}
      role={onCardClick ? "button" : undefined}
    >
      <a
        href={onCardClick ? undefined : `/events/${event.id}`}
        className="block p-4 pb-0 no-underline"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap gap-1">
              {categories.map((cat) => (
                <span
                  key={cat}
                  className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${eventCategoryColors[cat] ?? eventCategoryColors["altro"]}`}
                >
                  {labels[cat] ?? cat}
                </span>
              ))}
            </div>
            <h3 className="mt-1 font-family-display text-base font-medium leading-snug text-primary">
              {event.title}
            </h3>
            {event.description && (
              <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-muted">
                {event.description}
              </p>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <div className="flex flex-col items-center rounded-xl bg-fare-light px-3 py-2">
              <span className="text-[10px] font-semibold uppercase text-fare/60">
                {new Date(event.dateStart + "T00:00:00Z").toLocaleDateString(locale === "it" ? "it-IT" : "en-GB", { month: "short", timeZone: "Europe/Rome" })}
              </span>
              <span className="font-family-display text-2xl font-semibold leading-tight text-fare">
                {parseInt(event.dateStart.substring(8, 10), 10)}
              </span>
            </div>
            {event.dateEnd && event.dateEnd !== event.dateStart && (
              <>
                <span className="text-[10px] text-muted">&ndash;</span>
                <div className="flex flex-col items-center rounded-xl bg-fare-light px-3 py-2">
                  <span className="text-[10px] font-semibold uppercase text-fare/60">
                    {new Date(event.dateEnd + "T00:00:00Z").toLocaleDateString(locale === "it" ? "it-IT" : "en-GB", { month: "short", timeZone: "Europe/Rome" })}
                  </span>
                  <span className="font-family-display text-2xl font-semibold leading-tight text-fare">
                    {parseInt(event.dateEnd.substring(8, 10), 10)}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </a>

      <div className="flex items-center justify-between gap-2 px-4 pb-3.5 pt-3">
        <div className="flex min-w-0 items-center gap-3 text-[11px] text-muted/70">
          {event.timeStart && (
            <span className="flex items-center gap-1">
              <ClockIcon className="h-3 w-3" />
              {event.timeStart}{event.timeEnd && ` \u2013 ${event.timeEnd}`}
            </span>
          )}
          <EventPriceBadge price={event.price} />
          {event.link && <EventLink href={event.link} />}
        </div>
        <CardContactButtons
          phone={event.phone}
          name={event.title}
          address={event.address}
          latitude={event.latitude}
          longitude={event.longitude}
        />
      </div>
    </div>
  );
}

export function SectionDivider({ title }: { title: string }) {
  return (
    <h2 className="mb-3 mt-8 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted first:mt-0">
      {title}
    </h2>
  );
}
