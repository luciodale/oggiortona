import { usePromotionsQuery } from "../../hooks/usePromotionsQuery";
import { usePromotionMutations } from "../../hooks/usePromotionMutations";
import { usePromotionForm } from "../../hooks/usePromotionForms";
import { useFormSheet } from "../../hooks/useFormSheet";
import { useLocale } from "../../i18n/useLocale";
import { getTodayISO } from "../../utils/date";
import { computeDateEnd } from "../../utils/promotions";
import type { PromotionRow } from "../../types/database";
import { Button } from "../ui/Button";
import { SummaryFormError } from "../ui/FormError";
import { PromotionForm } from "./storefront/PromotionForm";
import { PromotionCardPublic } from "../PromotionCardPublic";
import { ListIcon } from "../../icons/ListIcon";

const MAX_ACTIVE = 3;

type ProfileStorefrontProps = {
  restaurantId: string;
};

export function ProfileStorefront({ restaurantId }: ProfileStorefrontProps) {
  const { t } = useLocale();
  const { restaurantName, activeCount, loading } = usePromotionsQuery(restaurantId);
  const { createPromotion, submitting } = usePromotionMutations(restaurantId);
  const { form, setForm, setType, errorMessage, buildCreateBody, resetForm } = usePromotionForm();
  const { openPromotionsList } = useFormSheet();

  const limitReached = activeCount >= MAX_ACTIVE;

  function handleCreate() {
    const body = buildCreateBody();
    if (!body) return;
    createPromotion(body, { onSuccess: resetForm });
  }

  const today = getTodayISO();
  const previewItem: PromotionRow = {
    id: 0,
    restaurantId: Number(restaurantId),
    type: form.type,
    title: form.title || "(titolo)",
    description: null,
    price: form.price ? Number(form.price) : null,
    dateStart: today,
    dateEnd: computeDateEnd(today, Number(form.durationDays)),
    timeStart: form.hasTime ? form.timeStart : null,
    timeEnd: form.hasTime ? form.timeEnd : null,
    createdAt: today,
  };

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

      <div className="mb-3 flex items-center justify-between rounded-xl bg-surface-warm px-3 py-2">
        <span className={`text-[12px] font-medium ${limitReached ? "text-danger" : "text-muted"}`}>
          {limitReached
            ? t("storefront.limitReached", { max: MAX_ACTIVE })
            : t("storefront.activeCount", { current: activeCount, max: MAX_ACTIVE })}
        </span>
      </div>

      <div className="rounded-2xl bg-card p-4 shadow-card">
        <PromotionForm
          form={form}
          onChange={setForm}
          onTypeChange={setType}
        />

        {errorMessage && (
          <div className="mt-4">
            <SummaryFormError message={errorMessage} />
          </div>
        )}

        <Button
          fullWidth
          className="mt-4"
          onClick={handleCreate}
          disabled={submitting || limitReached}
        >
          {submitting ? t("common.saving") : t("common.publish")}
        </Button>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">
          {t("storefront.preview")}
        </p>
        <PromotionCardPublic item={previewItem} />
      </div>

      <button
        type="button"
        onClick={() => openPromotionsList(Number(restaurantId))}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-border py-3 text-[13px] font-semibold text-muted transition-colors hover:text-primary"
      >
        <ListIcon className="h-4 w-4" />
        Gestisci pubblicazioni
      </button>
    </div>
  );
}
