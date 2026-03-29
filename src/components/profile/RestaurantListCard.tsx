import { Link } from "@tanstack/react-router";
import { restaurantTypeLabels } from "../../config/categories";
import { useLocale } from "../../i18n/useLocale";
import type { RestaurantWithStatus } from "../../types/domain";

type RestaurantListCardProps = {
  restaurant: RestaurantWithStatus;
};

export function RestaurantListCard({ restaurant }: RestaurantListCardProps) {
  const { locale, t } = useLocale();
  const labels = restaurantTypeLabels(locale);

  function handleDelete() {
    if (!window.confirm(t("profile.confirmDeleteVenue"))) return;
    fetch(`/api/restaurants/${restaurant.id}`, { method: "DELETE" }).then((res) => {
      if (res.ok) window.location.reload();
    });
  }

  return (
    <div className="rounded-2xl bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <p className="font-family-display text-base font-medium text-primary">
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
      <div className="mt-3 flex gap-3">
        <Link
          to="/restaurant/$id"
          params={{ id: String(restaurant.id) }}
          className="text-[12px] font-semibold text-muted no-underline transition-colors hover:text-primary"
        >
          {t("profile.previewCard")}
        </Link>
        <Link
          to="/restaurant/$id/edit"
          params={{ id: String(restaurant.id) }}
          className="text-[12px] font-semibold text-accent no-underline transition-colors hover:text-accent-hover"
        >
          {t("common.edit")}
        </Link>
        <Link
          to="/restaurant/$id/storefront"
          params={{ id: String(restaurant.id) }}
          className="text-[12px] font-semibold text-violet-600 no-underline transition-colors hover:text-violet-800"
        >
          {t("profile.storefront")}
        </Link>
        <button
          type="button"
          onClick={handleDelete}
          className="text-[12px] font-semibold text-danger transition-colors hover:text-danger/80"
        >
          {t("common.delete")}
        </button>
      </div>
    </div>
  );
}
