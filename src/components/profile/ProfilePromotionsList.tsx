import { usePromotionsQuery } from "../../hooks/usePromotionsQuery";
import { usePromotionMutations } from "../../hooks/usePromotionMutations";
import { useFormSheet } from "../../hooks/useFormSheet";
import type { PromotionRow } from "../../types/database";
import { PromotionsList } from "./storefront/PromotionsList";

type ProfilePromotionsListProps = {
  restaurantId: string;
};

export function ProfilePromotionsList({ restaurantId }: ProfilePromotionsListProps) {
  const { items, restaurantName, loading } = usePromotionsQuery(restaurantId);
  const { deletePromotion, renewPromotion } = usePromotionMutations(restaurantId);
  const { openPromotionEdit } = useFormSheet();

  function handleEdit(promotion: PromotionRow) {
    openPromotionEdit(Number(restaurantId), promotion);
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-accent" />
      </div>
    );
  }

  return (
    <div>
      {restaurantName && (
        <p className="mb-3 text-[11px] text-muted">{restaurantName}</p>
      )}
      {items.length === 0 ? (
        <p className="py-10 text-center text-[13px] text-muted">Nessuna pubblicazione</p>
      ) : (
        <PromotionsList
          items={items}
          onEdit={handleEdit}
          onRenew={renewPromotion}
          onDelete={deletePromotion}
        />
      )}
    </div>
  );
}
