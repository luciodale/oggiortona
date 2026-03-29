import { eventCategoryColors, eventCategoryLabels } from "../../config/categories";
import { ClockIcon } from "../../icons/ClockIcon";
import { MapPinIcon } from "../../icons/MapPinIcon";
import { MessageIcon } from "../../icons/MessageIcon";
import { PhoneIcon } from "../../icons/PhoneIcon";
import type { EventRow } from "../../types/database";
import { IconBubble } from "../shared/IconBubble";
import { EventPriceBadge } from "./EventPriceBadge";

type EventCardProps = {
  event: EventRow;
};

export function EventCard({ event }: EventCardProps) {
  const categories = event.category.split(",").map((c) => c.trim());

  return (
    <div className="zipper-card rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <a
        href={`/events/${event.id}`}
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
                  {eventCategoryLabels[cat] ?? cat}
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
            <div className="mt-2 flex items-center gap-3 text-[11px] text-muted/70">
              {event.timeStart && (
                <span className="flex items-center gap-1">
                  <ClockIcon className="h-3 w-3" />
                  {event.timeStart}{event.timeEnd && ` \u2013 ${event.timeEnd}`}
                </span>
              )}
              <EventPriceBadge price={event.price} />
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-center rounded-xl bg-fare-light px-3 py-2">
            <span className="text-[10px] font-semibold uppercase text-fare/60">
              {new Date(event.dateStart).toLocaleDateString("it-IT", { month: "short" })}
            </span>
            <span className="font-family-display text-2xl font-semibold leading-tight text-fare">
              {new Date(event.dateStart).getDate()}
            </span>
          </div>
        </div>
      </a>

      <div className="flex items-center justify-between gap-2 px-4 pb-3.5 pt-3">
        <div className="flex items-center gap-1.5">
          {event.phone && (
            <>
              <IconBubble
                href={`https://wa.me/${event.phone.replace(/[\s\-+()]/g, "")}?text=${encodeURIComponent("Da Oggi a Ortona, messaggio:")}`}
                label={`Scrivi su WhatsApp per ${event.title}`}
                external
              >
                <MessageIcon className="h-3.5 w-3.5" />
              </IconBubble>
              <IconBubble
                href={`tel:${event.phone}`}
                label={`Chiama per ${event.title}`}
              >
                <PhoneIcon className="h-3.5 w-3.5" />
              </IconBubble>
            </>
          )}
        </div>
        <IconBubble
          href={
            event.latitude != null && event.longitude != null
              ? `https://www.google.com/maps/search/?api=1&query=${event.latitude},${event.longitude}`
              : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address)}`
          }
          label={`Indicazioni per ${event.title}`}
          external
        >
          <MapPinIcon className="h-3.5 w-3.5" />
        </IconBubble>
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
