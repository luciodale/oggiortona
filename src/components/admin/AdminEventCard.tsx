import { eventCategoryColors, eventCategoryLabels } from "../../config/categories";
import type { EventRow } from "../../types/database";
import { formatDateShort } from "../../utils/date";

type AdminEventCardProps = {
  event: EventRow & { ownerEmail: string | null };
  onToggle: () => void;
};

export function AdminEventCard({ event, onToggle }: AdminEventCardProps) {
  const isActive = event.active === 1;
  const colorClass = eventCategoryColors[event.category] ?? "bg-stone-100 text-stone-600";

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${colorClass}`}>
            {eventCategoryLabels[event.category] ?? event.category}
          </span>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
              isActive ? "bg-success/10 text-success" : "bg-amber-50 text-amber-700"
            }`}
          >
            {isActive ? "Attivo" : "Inattivo"}
          </span>
        </div>
        <p className="mt-1 font-family-display text-base font-medium text-primary">
          {event.title}
        </p>
        <p className="mt-0.5 text-[11px] text-muted">
          {formatDateShort(event.dateStart)} · {event.address}
        </p>
        {event.ownerEmail && (
          <p className="mt-0.5 text-[10px] text-muted/50">{event.ownerEmail}</p>
        )}
      </div>
      <button
        type="button"
        onClick={onToggle}
        aria-label={`${isActive ? "Disabilita" : "Approva"} ${event.title}`}
        className={`shrink-0 rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-colors ${
          isActive
            ? "bg-danger/10 text-danger hover:bg-danger/20"
            : "bg-success/10 text-success hover:bg-success/20"
        }`}
      >
        {isActive ? "Disabilita" : "Approva"}
      </button>
    </div>
  );
}
