import { useLocale } from "../../i18n/useLocale";
import { eventCategoryColors, eventCategoryLabels } from "../../config/categories";
import { formatDateLong } from "../../utils/date";
import { CalendarIcon } from "../../icons/CalendarIcon";
import { ClockIcon } from "../../icons/ClockIcon";
import { TagIcon } from "../../icons/TagIcon";
import { EventLink } from "./EventLink";
import type { EventRow } from "../../types/database";

type EventDetailBodyProps = {
  event: EventRow;
};

export function EventDetailBody({ event }: EventDetailBodyProps) {
  const { locale, t } = useLocale();
  const categories = event.category.split(",").map((c: string) => c.trim());
  const catLabels = eventCategoryLabels(locale);

  return (
    <>
      <div className="flex flex-wrap gap-1">
        {categories.map((cat: string) => (
          <span key={cat} className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${eventCategoryColors[cat] ?? "bg-stone-100 text-stone-600"}`}>
            {catLabels[cat] ?? cat}
          </span>
        ))}
      </div>

      <h1 className="mt-3 font-family-display text-2xl font-medium leading-tight text-primary">{event.title}</h1>

      <div className="mt-5 space-y-3 rounded-2xl bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-3 text-[13px] text-primary">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-fare-light">
            <CalendarIcon className="h-4 w-4 text-fare" />
          </div>
          <div>
            <span className="capitalize">{formatDateLong(event.dateStart, locale)}</span>
            {event.dateEnd && <span> &ndash; <span className="capitalize">{formatDateLong(event.dateEnd, locale)}</span></span>}
          </div>
        </div>
        {event.timeStart && (
          <div className="flex items-center gap-3 text-[13px] text-primary">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-fare-light">
              <ClockIcon className="h-4 w-4 text-fare" />
            </div>
            <span>{event.timeStart}{event.timeEnd && ` \u2013 ${event.timeEnd}`}</span>
          </div>
        )}
        {event.price != null && (
          <div className="flex items-center gap-3 text-[13px] text-primary">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-fare-light">
              <TagIcon className="h-4 w-4 text-fare" />
            </div>
            <span className="font-medium">{event.price.toFixed(2)}&euro;</span>
          </div>
        )}
      </div>

      <div className="mt-5 flex gap-2">
        {event.phone && (
          <a href={`https://wa.me/${event.phone.replace(/[\s\-+()]/g, "")}?text=${encodeURIComponent(t("aria.whatsappMessage"))}`} target="_blank" rel="noopener noreferrer" className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-[13px] font-semibold text-white no-underline transition-all hover:bg-[#1FAD55] active:scale-[0.98]">{t("common.whatsapp")}</a>
        )}
        <a href={event.latitude != null && event.longitude != null ? `https://www.google.com/maps/search/?api=1&query=${event.latitude},${event.longitude}` : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address)}`} target="_blank" rel="noopener noreferrer" className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3 text-[13px] font-semibold text-white no-underline transition-all hover:bg-primary/90 active:scale-[0.98]">{t("common.directions")}</a>
        {event.phone && (
          <a href={`tel:${event.phone}`} className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-white py-3 text-[13px] font-semibold text-primary no-underline transition-all hover:bg-surface-alt active:scale-[0.98]">{t("common.call")}</a>
        )}
      </div>

      {event.link && <EventLink href={event.link} className="mt-4 inline-flex text-[13px] font-semibold" />}

      {event.description && (
        <div className="mt-6">
          <h2 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">{t("common.details")}</h2>
          <p className="text-[13px] leading-relaxed text-muted">{event.description}</p>
        </div>
      )}

      <div className="mt-8">
        <h2 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">{t("common.address")}</h2>
        <p className="text-[13px] text-primary">{event.address}</p>
      </div>
    </>
  );
}
