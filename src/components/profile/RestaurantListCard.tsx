import { Link } from "@tanstack/react-router";
import type { RestaurantWithStatus } from "../../types/domain";
import { restaurantTypeLabels } from "../../config/categories";

type RestaurantListCardProps = {
  restaurant: RestaurantWithStatus;
};

export function RestaurantListCard({ restaurant }: RestaurantListCardProps) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <p className="font-[family-name:var(--font-family-display)] text-base font-medium text-primary">
        {restaurant.name}
      </p>
      <p className="mt-0.5 text-[11px] capitalize text-muted">
        {restaurant.types.map((t) => restaurantTypeLabels[t] ?? t).join(" · ")}
      </p>
      {restaurant.active === 0 && (
        <span className="mt-1.5 inline-block rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
          In attesa di approvazione
        </span>
      )}
      <div className="mt-3 flex gap-3">
        <Link
          to="/restaurant/$id"
          params={{ id: String(restaurant.id) }}
          className="text-[12px] font-semibold text-muted no-underline transition-colors hover:text-primary"
        >
          Anteprima
        </Link>
        <Link
          to="/restaurant/$id/edit"
          params={{ id: String(restaurant.id) }}
          className="text-[12px] font-semibold text-accent no-underline transition-colors hover:text-accent-hover"
        >
          Modifica
        </Link>
        <Link
          to="/restaurant/$id/storefront"
          params={{ id: String(restaurant.id) }}
          className="text-[12px] font-semibold text-violet-600 no-underline transition-colors hover:text-violet-800"
        >
          Vetrina
        </Link>
      </div>
    </div>
  );
}
