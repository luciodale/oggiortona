import { useSwipeBarContext } from "@luciodale/swipe-bar";
import { useNavigate } from "@tanstack/react-router";
import { eventCategoryColors, eventCategoryLabels } from "../../config/categories";
import type { EventRow } from "../../types/database";
import type { SheetMeta } from "../../types/domain";
import { formatDateShort } from "../../utils/date";

type AdminEventCardProps = {
  event: EventRow & { ownerEmail: string | null; ownerName: string | null };
  onToggle: () => void;
  onDelete?: () => void;
};

export function AdminEventCard({ event, onToggle, onDelete }: AdminEventCardProps) {
  const { openSidebar } = useSwipeBarContext();
  const navigate = useNavigate();
  const catLabels = eventCategoryLabels("it");
  const isActive = event.active === 1;
  const colorClass = eventCategoryColors[event.category] ?? "bg-stone-100 text-stone-600";

  function handleCardClick() {
    const meta: SheetMeta = { kind: "event", data: event };
    openSidebar("bottom", { meta });
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleCardClick(); } }}
      className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${colorClass}`}>
            {catLabels[event.category] ?? event.category}
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
          {formatDateShort(event.dateStart, "it")} · {event.address}
        </p>
        {(event.ownerName || event.ownerEmail) && (
          <p className="mt-0.5 text-[10px] text-muted/50">
            {[event.ownerName, event.ownerEmail].filter(Boolean).join(" · ")}
          </p>
        )}
      </div>
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); navigate({ to: `/profile/event/${event.id}/edit` }); }}
          aria-label={`Modifica ${event.title}`}
          className="rounded-lg bg-accent/10 px-3 py-1.5 text-[11px] font-semibold text-accent transition-colors hover:bg-accent/20"
        >
          Modifica
        </button>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onToggle(); }}
          aria-label={`${isActive ? "Disabilita" : "Approva"} ${event.title}`}
          className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-colors ${
            isActive
              ? "bg-danger/10 text-danger hover:bg-danger/20"
              : "bg-success/10 text-success hover:bg-success/20"
          }`}
        >
          {isActive ? "Disabilita" : "Approva"}
        </button>
        {onDelete && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            aria-label={`Elimina ${event.title}`}
            className="rounded-lg bg-danger/10 px-3 py-1.5 text-[11px] font-semibold text-danger transition-colors hover:bg-danger/20"
          >
            Elimina
          </button>
        )}
      </div>
    </div>
  );
}
