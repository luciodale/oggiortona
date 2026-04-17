import { useStorePromotionsQuery } from "../../hooks/useStorePromotionsQuery";
import { useStorePromotionMutations } from "../../hooks/useStorePromotionMutations";
import { useStorePromotionForm } from "../../hooks/useStorePromotionForm";
import { useFormSheet } from "../../hooks/useFormSheet";
import { useLocale } from "../../i18n/useLocale";
import { getTodayISO } from "../../utils/date";
import { PROMOTION_DURATION_DAYS, computeDateEnd } from "../../utils/promotions";
import { formatRemainingMs } from "../../utils/cooldownFormat";
import type { StorePromotionRow } from "../../types/database";
import { Button } from "../ui/Button";
import { SummaryFormError } from "../ui/FormError";
import { StorePromotionForm } from "./storefront-store/StorePromotionForm";
import { StorePromotionCardPublic } from "../StorePromotionCardPublic";
import { ListIcon } from "../../icons/ListIcon";

type ProfileStoreStorefrontProps = {
  storeId: string;
};

export function ProfileStoreStorefront({ storeId }: ProfileStoreStorefrontProps) {
  const { t } = useLocale();
  const { storeName, cooldown, loading } = useStorePromotionsQuery(storeId);
  const { createPromotion, submitting } = useStorePromotionMutations(storeId);
  const { form, setForm, setType, errorMessage, titleError, validateTitle, buildCreateBody, resetForm } = useStorePromotionForm();
  const { openStorePromotionsList } = useFormSheet();

  const limitReached = cooldown.used >= cooldown.max;
  const remaining = formatRemainingMs(cooldown.remainingMs);

  function handleCreate() {
    const body = buildCreateBody();
    if (!body) return;
    createPromotion(body, { onSuccess: resetForm });
  }

  const today = getTodayISO();
  const previewItem: StorePromotionRow = {
    id: 0,
    storeId: Number(storeId),
    type: form.type,
    title: form.title || t("storefront.titleFallback"),
    description: null,
    price: form.price ? Number(form.price) : null,
    dateStart: today,
    dateEnd: computeDateEnd(today, PROMOTION_DURATION_DAYS),
    timeStart: form.timeStart || null,
    timeEnd: form.timeEnd || null,
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
      {storeName && (
        <p className="mb-3 text-[11px] text-muted">{storeName}</p>
      )}

      <div className="mb-3 flex flex-col gap-1 rounded-xl bg-surface-warm px-3 py-2">
        <span className="text-[12px] font-medium text-primary">
          {t("storefront.cooldownInfo", { max: cooldown.max, hours: cooldown.windowHours })}
        </span>
        <span className={`text-[11px] ${limitReached ? "text-danger" : "text-muted"}`}>
          {t("storefront.cooldownUsed", { used: cooldown.used, max: cooldown.max })}
          {" · "}
          {limitReached && remaining
            ? t("storefront.cooldownRemaining", { time: remaining })
            : t("storefront.cooldownAvailable")}
        </span>
      </div>

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
          onClick={handleCreate}
          disabled={submitting || limitReached}
        >
          {submitting ? t("common.saving") : t("common.publish")}
        </Button>

        <p className="mt-2 text-[11px] text-muted">
          {t("storefront.bumpNoticeStore")}
        </p>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">
          {t("storefront.preview")}
        </p>
        <StorePromotionCardPublic item={previewItem} />
      </div>

      <button
        type="button"
        onClick={() => openStorePromotionsList(Number(storeId))}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-border py-3 text-[13px] font-semibold text-muted transition-colors hover:text-primary"
      >
        <ListIcon className="h-4 w-4" />
        {t("storefront.managePublications")}
      </button>
    </div>
  );
}
