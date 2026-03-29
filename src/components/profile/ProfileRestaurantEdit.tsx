import { Link, useParams } from "@tanstack/react-router";
import { useRestaurantDetail } from "../../hooks/useRestaurantDetail";
import { ArrowLeftIcon } from "../../icons/ArrowLeftIcon";
import { parseTypes } from "../../utils/restaurant";
import { parseOpeningHours } from "../../utils/time";
import { RestaurantForm } from "../restaurants/RestaurantForm";

export function ProfileRestaurantEdit() {
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

  const initialData = {
    name: restaurant.name,
    description: restaurant.description,
    types: parseTypes(restaurant.type),
    priceRange: restaurant.priceRange,
    phone: restaurant.phone,
    address: restaurant.address,
    latitude: restaurant.latitude,
    longitude: restaurant.longitude,
    menuUrl: restaurant.menuUrl,
    parsedHours: parseOpeningHours(restaurant.openingHours),
  };

  return (
    <div>
      <Link
        to="/restaurant/$id"
        params={{ id: String(restaurant.id) }}
        className="mb-4 inline-flex items-center gap-1 text-xs font-medium text-muted no-underline hover:text-primary"
      >
        <ArrowLeftIcon className="h-3.5 w-3.5" />
        Torna al locale
      </Link>

      <h1 className="font-family-display text-2xl font-medium tracking-tight text-primary">
        Modifica locale
      </h1>

      <div className="mt-6">
        <RestaurantForm restaurantId={restaurant.id} initialData={initialData} />
      </div>
    </div>
  );
}
