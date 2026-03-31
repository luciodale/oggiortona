import { Link, useParams } from "@tanstack/react-router";
import { usePromotionsQuery } from "../../hooks/usePromotionsQuery";
import { usePromotionMutations } from "../../hooks/usePromotionMutations";
import { usePromotionForms } from "../../hooks/usePromotionForms";
import { useLocale } from "../../i18n/useLocale";
import { ArrowLeftIcon } from "../../icons/ArrowLeftIcon";
import { Button } from "../ui/Button";
import { SummaryFormError } from "../ui/FormError";
import { PromotionForm } from "./storefront/PromotionForm";
import { PromotionsList } from "./storefront/PromotionsList";

type PromotionTab = "special" | "deal" | "news";

export function ProfileStorefront() {
  const { t } = useLocale();
  const { id } = useParams({ strict: false });
  const { items, restaurantName, loading } = usePromotionsQuery(id);
  const { createPromotion, deletePromotion, renewPromotion, submitting } = usePromotionMutations(id);
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
      <Link
        to="/profile"
        className="mb-4 inline-flex items-center gap-1 text-xs font-medium text-muted no-underline hover:text-primary"
      >
        <ArrowLeftIcon className="h-3.5 w-3.5" />
        {t("profile.backToProfile")}
      </Link>

      <h1 className="font-family-display text-xl font-medium tracking-tight text-primary">
        {t("profile.storefront")}
      </h1>
      {restaurantName && (
        <p className="mt-0.5 text-[11px] text-muted">{restaurantName}</p>
      )}

      <div className="mt-5 flex rounded-xl bg-surface-warm p-0.5" role="tablist" aria-label="Tipo">
        {(["special", "deal", "news"] as const).map((tp) => (
          <button
            key={tp}
            type="button"
            role="tab"
            aria-selected={tab === tp}
            onClick={() => setTab(tp)}
            className={`flex flex-1 items-center justify-center rounded-lg py-2 text-[11px] font-semibold uppercase tracking-[0.06em] transition-all ${
              tab === tp ? "bg-white text-primary shadow-sm" : "text-muted"
            }`}
          >
            {TAB_LABELS[tp]}
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-2xl bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
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
