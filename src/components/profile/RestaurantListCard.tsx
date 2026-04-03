import { useSwipeBarContext } from "@luciodale/swipe-bar";
import { restaurantTypeLabels } from "../../config/categories";
import { useDeleteEntity } from "../../hooks/useDeleteEntity";
import { useFormSheet } from "../../hooks/useFormSheet";
import { useLocale } from "../../i18n/useLocale";
import { XIcon } from "../../icons/XIcon";
import type { RestaurantWithStatus, SheetMeta } from "../../types/domain";
import { PillActionButton } from "../shared/PillAction";

type RestaurantListCardProps = {
  restaurant: RestaurantWithStatus;
};

export function RestaurantListCard({ restaurant }: RestaurantListCardProps) {
  const { locale, t } = useLocale();
  const labels = restaurantTypeLabels(locale);
  const { handleDelete } = useDeleteEntity("restaurant");
  const { openSidebar } = useSwipeBarContext();
  const { openRestaurantForm, openStorefront } = useFormSheet();

  function handlePreview() {
    const meta: SheetMeta = { kind: "restaurant", data: restaurant };
    openSidebar("bottom", { meta });
  }

  return (
    <div className="relative rounded-2xl bg-card p-4 shadow-card">
      <button
        type="button"
        onClick={() => handleDelete(restaurant.id)}
        aria-label={t("common.delete")}
        className="absolute top-2 right-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-danger/10 text-danger transition-colors hover:bg-danger/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <XIcon className="h-3.5 w-3.5" strokeWidth={2.5} />
      </button>
      <p className="pr-8 font-family-display text-base font-medium text-primary">
        {restaurant.name}
      </p>
      <p className="mt-0.5 text-[11px] capitalize text-muted">
        {restaurant.types.map((tp) => labels[tp] ?? tp).join(" · ")}
      </p>
      {restaurant.expiredPromotionCount > 0 && (
        <span className="mt-1.5 inline-block rounded-full bg-danger/10 px-2.5 py-0.5 text-[10px] font-semibold text-danger">
          {restaurant.expiredPromotionCount} {restaurant.expiredPromotionCount === 1 ? t("promo.expiredOne") : t("promo.expiredMany")}
        </span>
      )}
      {restaurant.active === 0 && (
        <span
          className={`mt-1.5 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
            restaurant.approved === 0
              ? "bg-status-pending-bg text-status-pending"
              : "bg-status-rejected-bg text-status-rejected"
          }`}
        >
          {restaurant.approved === 0
            ? t("profile.pendingApproval")
            : t("profile.disabledByAdmin")}
        </span>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        <PillActionButton
          onClick={handlePreview}
          label={t("profile.previewCard")}
        />
        <PillActionButton
          onClick={() => openRestaurantForm(restaurant)}
          label={t("common.edit")}
          variant="accent"
        />
        <PillActionButton
          onClick={() => openStorefront(restaurant.id)}
          label={t("profile.storefront")}
          variant="promo"
        />
      </div>
    </div>
  );
}
