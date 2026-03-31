import { Link, useParams } from "@tanstack/react-router";
import { useLocale } from "../i18n/useLocale";
import { useRestaurantDetail } from "../hooks/useRestaurantDetail";
import { ContentLoader } from "../components/shared/ContentLoader";
import { RestaurantDetailBody } from "../components/restaurants/RestaurantDetailBody";
import { ArrowLeftIcon } from "../icons/ArrowLeftIcon";

export function RestaurantDetailRoute() {
  const { id } = useParams({ strict: false });
  const { t } = useLocale();
  const { restaurant, loading } = useRestaurantDetail(id);

  if (loading || !restaurant) {
    return <ContentLoader />;
  }

  return (
    <>
      <Link to="/restaurants" className="mb-4 inline-flex items-center gap-1 text-xs font-medium text-muted no-underline hover:text-primary">
        <ArrowLeftIcon className="h-3.5 w-3.5" />
        {t("restaurants.allVenues")}
      </Link>

      <div className="animate-fade-up">
        <RestaurantDetailBody restaurant={restaurant} />
        <div className="pb-4" />
      </div>
    </>
  );
}
