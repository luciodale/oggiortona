import type { PromotionRow, RestaurantRow } from "../../types/database";
import { AdminRestaurantCard } from "./AdminRestaurantCard";

type AdminRestaurantListProps = {
  restaurants: Array<RestaurantRow & { ownerEmail: string | null; promotions: Array<PromotionRow> }>;
  loading: boolean;
  expandedId: number | null;
  onExpand: (id: number | null) => void;
  onToggle: (id: number) => void;
  onDeletePromotion: (promotionId: number, restaurantId: number) => void;
};

export function AdminRestaurantList({
  restaurants,
  loading,
  expandedId,
  onExpand,
  onToggle,
  onDeletePromotion,
}: AdminRestaurantListProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-12" role="status" aria-label="Caricamento">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-accent" />
        <span className="sr-only">Caricamento in corso...</span>
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <p className="py-12 text-center font-family-display text-lg italic text-muted/50">
        Nessun risultato
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {restaurants.map((r) => (
        <AdminRestaurantCard
          key={r.id}
          restaurant={r}
          expanded={expandedId === r.id}
          onExpand={() => onExpand(expandedId === r.id ? null : r.id)}
          onToggle={() => onToggle(r.id)}
          onDeletePromotion={(pid) => onDeletePromotion(pid, r.id)}
        />
      ))}
    </div>
  );
}
