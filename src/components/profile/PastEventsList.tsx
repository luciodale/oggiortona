import { useState } from "react";
import { useLocale } from "../../i18n/useLocale";
import { ChevronDownIcon } from "../../icons/ChevronDownIcon";
import type { EventRow } from "../../types/database";
import { EventListCard } from "./EventListCard";

type PastEventsListProps = {
  events: Array<EventRow>;
};

export function PastEventsList({ events }: PastEventsListProps) {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);

  if (events.length === 0) return null;

  return (
    <div className="mt-8">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="mb-3 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted transition-colors hover:text-primary"
      >
        {t("profile.pastEvents")} ({events.length})
        <ChevronDownIcon
          className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`}
          strokeWidth={2.5}
        />
      </button>
      {open && (
        <div className="flex flex-col gap-3">
          {events.map((e) => (
            <EventListCard key={e.id} event={e} />
          ))}
        </div>
      )}
    </div>
  );
}
