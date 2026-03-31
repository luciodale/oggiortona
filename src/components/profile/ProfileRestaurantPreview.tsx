import { Link, useParams } from "@tanstack/react-router";
import { useRestaurantDetail } from "../../hooks/useRestaurantDetail";
import { useLocale } from "../../i18n/useLocale";
import { ArrowLeftIcon } from "../../icons/ArrowLeftIcon";
import { RestaurantCard } from "../restaurants/RestaurantCard";
import { RestaurantDetailBody } from "../restaurants/RestaurantDetailBody";

export function ProfileRestaurantPreview() {
  const { t } = useLocale();
  const { id } = useParams({ strict: false });
  const { restaurant, loading } = useRestaurantDetail(id);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-accent" />
      </div>
    );
  }

  if (!restaurant) {
    return <p className="py-12 text-center text-sm text-muted">Locale non trovato</p>;
  }

  return (
    <div>
      <Link
        to="/profile"
        className="mb-4 inline-flex items-center gap-1 text-xs font-medium text-muted no-underline hover:text-primary"
      >
        <ArrowLeftIcon className="h-3.5 w-3.5" />
        {t("nav.profile")}
      </Link>

      <RestaurantDetailBody restaurant={restaurant} />

      <div className="mt-10 pb-4">
        <h2 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">
          {t("profile.previewCard")}
        </h2>
        <RestaurantCard restaurant={restaurant} isPinned={false} zipperCard={false} />
      </div>
    </div>
  );
}
