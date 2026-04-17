import { useSwipeBarContext } from "@luciodale/swipe-bar";
import { useFormSheet } from "../../hooks/useFormSheet";
import type { StorePromotionRow, StoreRow } from "../../types/database";
import type { SheetMeta } from "../../types/domain";
import { enrichStore } from "../../utils/enrichStore";

type AdminStoreCardProps = {
  store: StoreRow & { ownerEmail: string | null; ownerName: string | null; promotions: Array<StorePromotionRow> };
  expanded: boolean;
  onExpand: () => void;
  onToggle: () => void;
};

export function AdminStoreCard({
  store,
  expanded,
  onExpand,
  onToggle,
}: AdminStoreCardProps) {
  const { openSidebar } = useSwipeBarContext();
  const { openStoreForm } = useFormSheet();
  const types = store.type.split(",").map((t) => t.trim());
  const isActive = store.active === 1;

  function handleCardClick() {
    const meta: SheetMeta = { kind: "store", data: enrichStore(store, store.promotions) };
    openSidebar("bottom", { meta });
  }

  return (
    <div className="rounded-2xl bg-card shadow-card">
      <div
        role="button"
        tabIndex={0}
        className="cursor-pointer bg-transparent p-4 text-left"
        onClick={handleCardClick}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleCardClick(); } }}
      >
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
              isActive ? "bg-success/10 text-success" : "bg-status-pending-bg text-status-pending"
            }`}
          >
            {isActive ? "Attivo" : "Inattivo"}
          </span>
          {store.promotions.length > 0 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onExpand(); }}
              aria-label={`${expanded ? "Nascondi" : "Mostra"} promozioni`}
              className="rounded-lg px-2 py-1.5 text-[11px] font-semibold text-muted transition-colors hover:text-primary"
            >
              {expanded ? "▲" : "▼"} {store.promotions.length}
            </button>
          )}
        </div>
        <p className="mt-1 font-family-display text-base font-medium text-primary">
          {store.name}
        </p>
        <p className="mt-0.5 text-[11px] capitalize text-muted">
          {types.join(" · ")}
        </p>
        {(store.ownerName || store.ownerEmail) && (
          <p className="mt-0.5 text-[10px] text-muted/50">
            {[store.ownerName, store.ownerEmail].filter(Boolean).join(" · ")}
          </p>
        )}
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); openStoreForm(store); }}
            aria-label={`Modifica ${store.name}`}
            className="rounded-lg bg-accent/10 px-3 py-1.5 text-[11px] font-semibold text-accent transition-colors hover:bg-accent/20"
          >
            Modifica
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onToggle(); }}
            aria-label={`${isActive ? "Disabilita" : "Approva"} ${store.name}`}
            className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-colors ${
              isActive
                ? "bg-danger/10 text-danger hover:bg-danger/20"
                : "bg-success/10 text-success hover:bg-success/20"
            }`}
          >
            {isActive ? "Disabilita" : "Approva"}
          </button>
        </div>
      </div>

      {expanded && store.promotions.length > 0 && (
        <div className="border-t border-border-light px-4 pb-4 pt-3">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">
            Promozioni attive ({store.promotions.length})
          </p>
          <div className="flex flex-col gap-2">
            {store.promotions.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-xl bg-surface-alt px-3 py-2"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-primary">
                    {p.title}
                  </p>
                  <p className="text-[11px] text-muted">
                    {p.type} · {p.dateStart} &ndash; {p.dateEnd}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {expanded && store.promotions.length === 0 && (
        <div className="border-t border-border-light px-4 py-3">
          <p className="text-[12px] italic text-muted/50">Nessuna promozione attiva</p>
        </div>
      )}
    </div>
  );
}
