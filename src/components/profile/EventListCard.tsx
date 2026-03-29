import { eventCategoryColors, eventCategoryLabels } from "../../config/categories";
import { useLocale } from "../../i18n/useLocale";
import type { EventRow } from "../../types/database";
import { formatDateLong } from "../../utils/date";

type EventListCardProps = {
  event: EventRow;
};

export function EventListCard({ event }: EventListCardProps) {
  const { locale } = useLocale();
  const catLabels = eventCategoryLabels(locale);
  const categories = event.category.split(",").map((c) => c.trim());

  return (
    <div className="rounded-2xl bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="flex flex-wrap gap-1">
        {categories.map((cat) => (
          <span
            key={cat}
            className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${eventCategoryColors[cat] ?? eventCategoryColors["altro"]}`}
          >
            {catLabels[cat] ?? cat}
          </span>
        ))}
      </div>
      <p className="mt-1 font-family-display text-base font-medium text-primary">
        {event.title}
      </p>
      <p className="mt-0.5 text-[11px] capitalize text-muted">
        {formatDateLong(event.dateStart, locale)}
        {event.dateEnd && ` \u2013 ${formatDateLong(event.dateEnd, locale)}`}
      </p>
      <div className="mt-3 flex gap-3">
        <a
          href={`/events/${event.id}`}
          className="text-[12px] font-semibold text-muted no-underline transition-colors hover:text-primary"
        >
          Anteprima
        </a>
      </div>
    </div>
  );
}
