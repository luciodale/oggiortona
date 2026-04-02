import { eventCategoryColors, eventCategoryLabels } from "../../config/categories";
import { useLocale } from "../../i18n/useLocale";
import { ChevronRightIcon } from "../../icons/ChevronRightIcon";
import { ClockIcon } from "../../icons/ClockIcon";
import { PinIcon } from "../../icons/PinIcon";
import type { EventRow } from "../../types/database";
import { CardContactButtons } from "../shared/CardContactButtons";
import { EventLink } from "./EventLink";
import { EventPriceBadge } from "./EventPriceBadge";
import { HighlightWrap } from "./HighlightWrap";

type EventCardProps = {
  event: EventRow;
  zipperCard?: boolean;
  onCardClick?: (event: EventRow) => void;
  isAdmin?: boolean;
  onToggleHighlight?: (id: number) => void;
  isPast?: boolean;
};

export function EventCard({ event, zipperCard = true, onCardClick, isAdmin, onToggleHighlight, isPast }: EventCardProps) {
  const { locale, t } = useLocale();
  const labels = eventCategoryLabels(locale);
  const categories = event.category.split(",").map((c) => c.trim());
  const isHighlighted = event.highlighted === 1 && !isPast;

  function handleClick(e: React.MouseEvent) {
    if (onCardClick) {
      e.preventDefault();
      onCardClick(event);
    }
  }

  function handlePinClick(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    onToggleHighlight?.(event.id);
  }

  const card = (
    <div
      className={`${zipperCard && !isHighlighted ? "zipper-card" : ""} rounded-2xl bg-card shadow-card ${onCardClick ? "cursor-pointer" : ""}`}
      onClick={handleClick}
      role={onCardClick ? "button" : undefined}
    >
      <a
        href={onCardClick ? undefined : `/events/${event.id}`}
        className="block p-4 pb-0 no-underline"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1">
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
            {event.timeStart && (
              <span className="mt-1.5 flex items-center gap-1 text-[11px] text-muted/70">
                <ClockIcon className="h-3 w-3" />
                {event.timeStart}{event.timeEnd && ` \u2013 ${event.timeEnd}`}
              </span>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            {isAdmin && onToggleHighlight && (
              <button
                type="button"
                onClick={handlePinClick}
                aria-pressed={isHighlighted}
                className={`flex items-center justify-center rounded-full p-1.5 transition-all duration-200 ${
                  isHighlighted ? "bg-fare/10 text-fare" : "text-muted/50 hover:text-muted/70"
                }`}
              >
                <PinIcon className="h-4 w-4" strokeWidth={isHighlighted ? 2.5 : 2} />
              </button>
            )}
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

      <div className="flex items-end justify-between gap-2 px-4 pb-3.5 pt-3">
        <div className="flex items-center gap-3">
          <CardContactButtons
            phone={event.phone}
            name={event.title}
            latitude={event.latitude}
            longitude={event.longitude}
          />
          <div className="flex items-center gap-3 text-[11px] text-muted/70">
            <EventPriceBadge price={event.price} />
            {event.link && <EventLink href={event.link} />}
          </div>
        </div>
        {onCardClick && (
          <span className="flex shrink-0 items-center gap-0.5 text-[11px] font-semibold text-accent">
            {t("common.details")}
            <ChevronRightIcon className="h-3.5 w-3.5" />
          </span>
        )}
      </div>
    </div>
  );

  if (!isHighlighted) return card;

  return (
    <HighlightWrap
      id={event.id}
      label={t("events.highlighted")}
      className={zipperCard ? "zipper-card" : ""}
    >
      {card}
    </HighlightWrap>
  );
}

export function SectionDivider({ title }: { title: string }) {
  return (
    <h2 className="mb-3 mt-8 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted first:mt-0">
      {title}
    </h2>
  );
}
