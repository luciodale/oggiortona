import { restaurantTypeLabels } from "../../config/categories";
import { useDeleteEntity } from "../../hooks/useDeleteEntity";
import { useLocale } from "../../i18n/useLocale";
import { XIcon } from "../../icons/XIcon";
import type { RestaurantWithStatus } from "../../types/domain";
import { PillActionLink } from "../shared/PillAction";

type RestaurantListCardProps = {
  restaurant: RestaurantWithStatus;
};

export function RestaurantListCard({ restaurant }: RestaurantListCardProps) {
  const { locale, t } = useLocale();
  const labels = restaurantTypeLabels(locale);
  const { handleDelete } = useDeleteEntity("restaurant");

  return (
    <div className="relative rounded-2xl bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
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
      {restaurant.active === 0 && (
        <span
          className={`mt-1.5 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
            restaurant.approved === 0
              ? "bg-amber-50 text-amber-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {restaurant.approved === 0
            ? t("profile.pendingApproval")
            : t("profile.disabledByAdmin")}
        </span>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        <PillActionLink
          to={`/profile/restaurant/${restaurant.id}`}
          label={t("profile.previewCard")}
        />
        <PillActionLink
          to={`/profile/restaurant/${restaurant.id}/edit`}
          label={t("common.edit")}
          variant="accent"
        />
        <PillActionLink
          to={`/profile/restaurant/${restaurant.id}/storefront`}
          label={t("profile.storefront")}
          variant="violet"
        />
      </div>
    </div>
  );
}
