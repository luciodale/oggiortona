import { eventCategoryLabels } from "../../config/categories";
import { useDeleteEntity } from "../../hooks/useDeleteEntity";
import { useFormSheet } from "../../hooks/useFormSheet";
import { useLocale } from "../../i18n/useLocale";
import { PencilIcon } from "../../icons/PencilIcon";
import { XIcon } from "../../icons/XIcon";
import type { EventWithRestaurant } from "../../types/domain";
import { formatDateLong } from "../../utils/date";

type EventListCardProps = {
  event: EventWithRestaurant;
};

export function EventListCard({ event }: EventListCardProps) {
  const { locale, t } = useLocale();
  const catLabels = eventCategoryLabels(locale);
  const categories = event.category.split(",").map((c) => c.trim());
  const { handleDelete } = useDeleteEntity("event");
  const { openEventForm } = useFormSheet();

  const isPending = event.active === 0;

  return (
    <div className="relative rounded-2xl bg-card p-4 shadow-card">
      {/* Top-right icon buttons */}
      <div className="absolute top-3 right-3 flex gap-1.5">
        <button
          type="button"
          onClick={() => openEventForm(event)}
          aria-label={t("common.edit")}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-accent transition-colors hover:bg-accent/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <PencilIcon className="h-3.5 w-3.5" strokeWidth={2.5} />
        </button>
        <button
          type="button"
          onClick={() => handleDelete(event.id)}
          aria-label={t("common.delete")}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-danger/10 text-danger transition-colors hover:bg-danger/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <XIcon className="h-3.5 w-3.5" strokeWidth={2.5} />
        </button>
      </div>

      {/* Info */}
      <div className="pr-20">
        <p className="font-family-display text-base font-medium text-primary">
          {event.title}
        </p>
        <p className="mt-0.5 text-[11px] capitalize text-muted">
          {categories.map((cat) => catLabels[cat] ?? cat).join(" · ")}
          {" · "}
          {formatDateLong(event.dateStart, locale)}
          {event.dateEnd && ` \u2013 ${formatDateLong(event.dateEnd, locale)}`}
        </p>
        {event.description && (
          <p className="mt-1.5 line-clamp-2 text-[12px] leading-relaxed text-muted">
            {event.description}
          </p>
        )}
      </div>

      {isPending && (
        <div className="mt-2">
          <span
            className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
              event.approved === 0
                ? "bg-status-pending-bg text-status-pending"
                : "bg-status-rejected-bg text-status-rejected"
            }`}
          >
            {event.approved === 0
              ? t("profile.pendingApproval")
              : t("profile.disabledByAdmin")}
          </span>
        </div>
      )}
    </div>
  );
}
