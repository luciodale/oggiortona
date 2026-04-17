import { useStorePromotionsQuery } from "../../hooks/useStorePromotionsQuery";
import { useStorePromotionMutations } from "../../hooks/useStorePromotionMutations";
import { useFormSheet } from "../../hooks/useFormSheet";
import type { StorePromotionRow } from "../../types/database";
import { StorePromotionsList } from "./storefront-store/StorePromotionsList";

type ProfileStorePromotionsListProps = {
  storeId: string;
};

export function ProfileStorePromotionsList({ storeId }: ProfileStorePromotionsListProps) {
  const { items, storeName, loading } = useStorePromotionsQuery(storeId);
  const { deletePromotion, renewPromotion } = useStorePromotionMutations(storeId);
  const { openStorePromotionEdit } = useFormSheet();

  function handleEdit(promotion: StorePromotionRow) {
    openStorePromotionEdit(Number(storeId), promotion);
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
      {storeName && (
        <p className="mb-3 text-[11px] text-muted">{storeName}</p>
      )}
      {items.length === 0 ? (
        <p className="py-10 text-center text-[13px] text-muted">Nessuna pubblicazione</p>
      ) : (
        <StorePromotionsList
          items={items}
          onEdit={handleEdit}
          onRenew={renewPromotion}
          onDelete={deletePromotion}
        />
      )}
    </div>
  );
}
