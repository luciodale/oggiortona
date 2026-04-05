import { useDeleteEntity } from "../../hooks/useDeleteEntity";
import { useFormSheet } from "../../hooks/useFormSheet";
import { useLocale } from "../../i18n/useLocale";
import { SquarePlusIcon } from "../../icons/SquarePlusIcon";
import { ListIcon } from "../../icons/ListIcon";
import { PencilIcon } from "../../icons/PencilIcon";
import { XIcon } from "../../icons/XIcon";
import type { RestaurantWithStatus } from "../../types/domain";

type RestaurantListCardProps = {
  restaurant: RestaurantWithStatus;
};

export function RestaurantListCard({ restaurant }: RestaurantListCardProps) {
  const { t } = useLocale();
  const { handleDelete } = useDeleteEntity("restaurant");
  const { openRestaurantForm, openStorefront, openPromotionsList } = useFormSheet();

  const hasPromotions = restaurant.promotions.length > 0 || restaurant.expiredPromotionCount > 0;
  const isPending = restaurant.active === 0;
  const hasExpired = restaurant.expiredPromotionCount > 0;
  const hasBadges = isPending || hasExpired;

  return (
    <div className="relative rounded-2xl bg-card p-4 shadow-card">
      {/* Top-right icon buttons */}
      <div className="absolute top-3 right-3 flex gap-1.5">
        <button
          type="button"
          onClick={() => openRestaurantForm(restaurant)}
          aria-label={t("common.edit")}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-accent transition-colors hover:bg-accent/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <PencilIcon className="h-3.5 w-3.5" strokeWidth={2.5} />
        </button>
        <button
          type="button"
          onClick={() => handleDelete(restaurant.id)}
          aria-label={t("common.delete")}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-danger/10 text-danger transition-colors hover:bg-danger/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <XIcon className="h-3.5 w-3.5" strokeWidth={2.5} />
        </button>
      </div>

      {/* Info */}
      <div className="pr-20">
        <p className="font-family-display text-base font-medium text-primary">
          {restaurant.name}
        </p>
        <p className="mt-0.5 text-[11px] capitalize text-muted">
          {restaurant.types.join(" · ")}
        </p>
        {restaurant.description && (
          <p className="mt-1.5 line-clamp-2 text-[12px] leading-relaxed text-muted">
            {restaurant.description}
          </p>
        )}
      </div>

      {hasBadges && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {isPending && (
            <span
              className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
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
          {hasExpired && (
            <span className="inline-block rounded-full bg-danger/10 px-2.5 py-0.5 text-[10px] font-semibold text-danger">
              {restaurant.expiredPromotionCount} {restaurant.expiredPromotionCount === 1 ? t("promo.expiredOne") : t("promo.expiredMany")}
            </span>
          )}
        </div>
      )}

      {/* Promotions */}
      <p className="mt-3 mb-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">{t("restaurants.promotions")}</p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => openStorefront(restaurant.id)}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-accent/10 py-2.5 text-[12px] font-semibold text-accent transition-colors hover:bg-accent/20"
        >
          <SquarePlusIcon className="h-3.5 w-3.5" strokeWidth={2.5} />
          {t("common.publish")}
        </button>
        {hasPromotions && (
          <button
            type="button"
            onClick={() => openPromotionsList(restaurant.id)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-secondary py-2.5 text-[12px] font-semibold text-muted transition-colors hover:text-primary"
          >
            <ListIcon className="h-3.5 w-3.5" strokeWidth={2.5} />
            {t("common.manage")}
          </button>
        )}
      </div>
    </div>
  );
}
