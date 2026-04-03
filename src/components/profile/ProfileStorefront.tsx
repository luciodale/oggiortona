import { usePromotionsQuery } from "../../hooks/usePromotionsQuery";
import { usePromotionMutations } from "../../hooks/usePromotionMutations";
import { usePromotionForms } from "../../hooks/usePromotionForms";
import { useLocale } from "../../i18n/useLocale";
import { Button } from "../ui/Button";
import { SummaryFormError } from "../ui/FormError";
import { PromotionForm } from "./storefront/PromotionForm";
import { PromotionsList } from "./storefront/PromotionsList";

type PromotionTab = "special" | "deal" | "news";

type ProfileStorefrontProps = {
  restaurantId: string;
};

export function ProfileStorefront({ restaurantId }: ProfileStorefrontProps) {
  const { t } = useLocale();
  const { items, restaurantName, loading } = usePromotionsQuery(restaurantId);
  const { createPromotion, deletePromotion, renewPromotion, submitting } = usePromotionMutations(restaurantId);
  const {
    tab, setTab,
    errorMessage,
    specialForm, setSpecialForm,
    dealForm, setDealForm,
    newsForm, setNewsForm,
    buildCreateBody, resetCurrentForm,
  } = usePromotionForms();

  const TAB_LABELS: Record<PromotionTab, string> = {
    special: t("storefront.dish"),
    deal: t("storefront.deal"),
    news: t("storefront.news"),
  };

  function handleCreate() {
    const body = buildCreateBody();
    if (!body) return;
    createPromotion(body, { onSuccess: resetCurrentForm });
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

      <div className="flex rounded-xl bg-surface-warm p-0.5" role="tablist" aria-label="Tipo">
        {(["special", "deal", "news"] as const).map((tp) => (
          <button
            key={tp}
            type="button"
            role="tab"
            aria-selected={tab === tp}
            onClick={() => setTab(tp)}
            className={`flex flex-1 items-center justify-center rounded-lg py-2 text-[11px] font-semibold uppercase tracking-[0.06em] transition-all ${
              tab === tp ? "bg-card text-primary shadow-sm" : "text-muted"
            }`}
          >
            {TAB_LABELS[tp]}
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-2xl bg-card p-4 shadow-card">
        {tab === "special" && (
          <PromotionForm
            form={specialForm}
            onChange={setSpecialForm}
            showTitle={false}
            descriptionLabel={t("storefront.descLabel")}
            descriptionPlaceholder={t("storefront.dishDescPlaceholder")}
          />
        )}
        {tab === "deal" && (
          <PromotionForm
            form={dealForm}
            onChange={setDealForm}
            showTitle={true}
            titlePlaceholder={t("storefront.dealTitlePlaceholder")}
            descriptionPlaceholder={t("storefront.dealDescPlaceholder")}
          />
        )}
        {tab === "news" && (
          <PromotionForm
            form={newsForm}
            onChange={setNewsForm}
            showTitle={true}
            titlePlaceholder={t("storefront.newsTitlePlaceholder")}
            descriptionPlaceholder={t("storefront.newsDescPlaceholder")}
          />
        )}

        {errorMessage && (
          <div className="mt-4">
            <SummaryFormError message={errorMessage} />
          </div>
        )}

        <Button
          fullWidth
          className="mt-4"
          onClick={handleCreate}
          disabled={submitting}
        >
          {submitting ? t("common.saving") : t("common.publish")}
        </Button>
      </div>

      <PromotionsList
        items={items}
        onRenew={renewPromotion}
        onDelete={deletePromotion}
      />
    </div>
  );
}
