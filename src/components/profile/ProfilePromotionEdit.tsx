import { usePromotionMutations } from "../../hooks/usePromotionMutations";
import { usePromotionForm, promotionToFormState } from "../../hooks/usePromotionForms";
import { useLocale } from "../../i18n/useLocale";
import type { PromotionRow } from "../../types/database";
import { Button } from "../ui/Button";
import { SummaryFormError } from "../ui/FormError";
import { PromotionForm } from "./storefront/PromotionForm";

type ProfilePromotionEditProps = {
  restaurantId: string;
  promotion: PromotionRow;
  onSuccess: () => void;
};

export function ProfilePromotionEdit({ restaurantId, promotion, onSuccess }: ProfilePromotionEditProps) {
  const { t } = useLocale();
  const { editPromotion, editing } = usePromotionMutations(restaurantId);
  const { form, setForm, setType, errorMessage, titleError, validateTitle, buildEditBody } =
    usePromotionForm(promotionToFormState(promotion));

  function handleSave() {
    const body = buildEditBody();
    if (!body) return;
    editPromotion(promotion.id, body, { onSuccess });
  }

  return (
    <div>
      <div className="rounded-2xl bg-card p-4 shadow-card">
        <PromotionForm
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
