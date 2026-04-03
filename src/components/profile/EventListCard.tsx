import { useSwipeBarContext } from "@luciodale/swipe-bar";
import { eventCategoryColors, eventCategoryLabels } from "../../config/categories";
import { useDeleteEntity } from "../../hooks/useDeleteEntity";
import { useFormSheet } from "../../hooks/useFormSheet";
import { useLocale } from "../../i18n/useLocale";
import { XIcon } from "../../icons/XIcon";
import type { EventRow } from "../../types/database";
import type { SheetMeta } from "../../types/domain";
import { formatDateLong } from "../../utils/date";
import { PillActionButton } from "../shared/PillAction";

type EventListCardProps = {
  event: EventRow;
};

export function EventListCard({ event }: EventListCardProps) {
  const { locale, t } = useLocale();
  const catLabels = eventCategoryLabels(locale);
  const categories = event.category.split(",").map((c) => c.trim());
  const { handleDelete } = useDeleteEntity("event");
  const { openSidebar } = useSwipeBarContext();
  const { openEventForm } = useFormSheet();

  function handlePreview() {
    const meta: SheetMeta = { kind: "event", data: event };
    openSidebar("bottom", { meta });
  }

  return (
    <div className="relative rounded-2xl bg-card p-4 shadow-card">
      <button
        type="button"
        onClick={() => handleDelete(event.id)}
        aria-label={t("common.delete")}
        className="absolute top-2 right-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-danger/10 text-danger transition-colors hover:bg-danger/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <XIcon className="h-3.5 w-3.5" strokeWidth={2.5} />
      </button>
      <div className="flex flex-wrap gap-1 pr-8">
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
      {event.active === 0 && (
        <span
          className={`mt-1.5 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
            event.approved === 0
              ? "bg-status-pending-bg text-status-pending"
              : "bg-status-rejected-bg text-status-rejected"
          }`}
        >
          {event.approved === 0
            ? t("profile.pendingApproval")
            : t("profile.disabledByAdmin")}
        </span>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        <PillActionButton
          onClick={handlePreview}
          label={t("profile.previewCard")}
        />
        <PillActionButton
          onClick={() => openEventForm(event)}
          label={t("common.edit")}
          variant="accent"
        />
      </div>
    </div>
  );
}
