import type { EventRow } from "../../types/database";
import { eventCategoryLabels, eventCategoryColors } from "../../config/categories";
import { formatDateItalian } from "../../utils/date";

type EventListCardProps = {
  event: EventRow;
};

export function EventListCard({ event }: EventListCardProps) {
  const categories = event.category.split(",").map((c) => c.trim());

  return (
    <div className="rounded-2xl bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
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
      <p className="mt-1 font-[family-name:var(--font-family-display)] text-base font-medium text-primary">
        {event.title}
      </p>
      <p className="mt-0.5 text-[11px] capitalize text-muted">
        {formatDateItalian(event.dateStart)}
        {event.dateEnd && ` \u2013 ${formatDateItalian(event.dateEnd)}`}
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
