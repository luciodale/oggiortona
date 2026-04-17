import { useStorePromotionMutations } from "../../hooks/useStorePromotionMutations";
import { useStorePromotionForm, storePromotionToFormState } from "../../hooks/useStorePromotionForm";
import { useLocale } from "../../i18n/useLocale";
import type { StorePromotionRow } from "../../types/database";
import { Button } from "../ui/Button";
import { SummaryFormError } from "../ui/FormError";
import { StorePromotionForm } from "./storefront-store/StorePromotionForm";

type ProfileStorePromotionEditProps = {
  storeId: string;
  promotion: StorePromotionRow;
  onSuccess: () => void;
};

export function ProfileStorePromotionEdit({ storeId, promotion, onSuccess }: ProfileStorePromotionEditProps) {
  const { t } = useLocale();
  const { editPromotion, editing } = useStorePromotionMutations(storeId);
  const { form, setForm, setType, errorMessage, titleError, validateTitle, buildEditBody } =
    useStorePromotionForm(storePromotionToFormState(promotion));

  function handleSave() {
    const body = buildEditBody();
    if (!body) return;
    editPromotion(promotion.id, body, { onSuccess });
  }

  return (
    <div>
      <div className="rounded-2xl bg-card p-4 shadow-card">
        <StorePromotionForm
          form={form}
          onChange={setForm}
          onTypeChange={setType}
          titleError={titleError}
          onValidateTitle={validateTitle}
        />

        {errorMessage && (
          <div className="mt-4">
            <SummaryFormError message={errorMessage} />
          </div>
        )}

        <Button
          fullWidth
          className="mt-4"
          onClick={handleSave}
          disabled={editing}
        >
          {editing ? t("common.saving") : t("common.saveChanges")}
        </Button>
      </div>
    </div>
  );
}
