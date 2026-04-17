import type { StorePromotionRow, StoreRow } from "../../types/database";
import { AdminStoreCard } from "./AdminStoreCard";

type AdminStoreListProps = {
  stores: Array<StoreRow & { ownerEmail: string | null; ownerName: string | null; promotions: Array<StorePromotionRow> }>;
  loading: boolean;
  expandedId: number | null;
  onExpand: (id: number | null) => void;
  onToggle: (id: number) => void;
};

export function AdminStoreList({
  stores,
  loading,
  expandedId,
  onExpand,
  onToggle,
}: AdminStoreListProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-12" role="status" aria-label="Caricamento">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-accent" />
        <span className="sr-only">Caricamento in corso...</span>
      </div>
    );
  }

  if (stores.length === 0) {
    return (
      <p className="py-12 text-center font-family-display text-lg italic text-muted/50">
        Nessun risultato
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {stores.map((s) => (
        <AdminStoreCard
          key={s.id}
          store={s}
          expanded={expandedId === s.id}
          onExpand={() => onExpand(expandedId === s.id ? null : s.id)}
          onToggle={() => onToggle(s.id)}
        />
      ))}
    </div>
  );
}
