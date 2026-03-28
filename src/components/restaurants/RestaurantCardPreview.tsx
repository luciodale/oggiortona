import type { RestaurantWithStatus } from "../../types/domain";
import { restaurantTypeLabels } from "../../config/categories";
import { formatDateShort } from "../../utils/date";

type RestaurantCardPreviewProps = {
  restaurant: RestaurantWithStatus;
};

export function RestaurantCardPreview({ restaurant }: RestaurantCardPreviewProps) {
  const specials = restaurant.promotions.filter((p) => p.type === "special");
  const deals = restaurant.promotions.filter((p) => p.type === "deal");

  return (
    <div className="rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="p-4 pb-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-[family-name:var(--font-family-display)] text-lg font-medium leading-tight text-primary">
              {restaurant.name}
            </h3>
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-muted">
              <span className="capitalize">
                {restaurant.types
                  .map((t) => restaurantTypeLabels[t] ?? t)
                  .join(" · ")}
              </span>
              <span aria-hidden="true">&middot;</span>
              <span>
                {Array.from({ length: 3 }, (_, i) => (
                  <span key={i} className={i < restaurant.priceRange ? "text-primary" : "text-border"}>
                    &euro;
                  </span>
                ))}
              </span>
            </div>
          </div>
          <span
            className={`mt-0.5 flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
              restaurant.isOpen
                ? "bg-success/10 text-success"
                : "bg-danger/10 text-danger"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                restaurant.isOpen ? "bg-success" : "bg-danger"
              }`}
              aria-hidden="true"
            />
            {restaurant.isOpen ? "Aperto" : "Chiuso"}
          </span>
        </div>

        {restaurant.description && (
          <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-muted">
            {restaurant.description}
          </p>
        )}

        {specials.map((special) => (
          <div key={special.id} className="mt-3 flex items-start gap-2 rounded-xl bg-mangiare-light px-3 py-2.5">
            <span className="mt-px text-sm" aria-hidden="true">&#9733;</span>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-mangiare">
                Piatto del giorno
              </p>
              <p className="mt-0.5 text-[13px] text-primary">
                {special.title}
                {special.price != null && (
                  <span className="ml-1 font-semibold">
                    {special.price.toFixed(2)}&euro;
                  </span>
                )}
              </p>
            </div>
          </div>
        ))}

        {deals.map((deal) => (
          <div key={deal.id} className="mt-3 flex items-start gap-2 rounded-xl bg-violet-50 px-3 py-2.5">
            <span className="mt-px text-sm" aria-hidden="true">&#9889;</span>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-violet-700">
                Offerta
              </p>
              <p className="mt-0.5 text-[13px] font-medium text-primary">
                {deal.title}
              </p>
              {deal.description && (
                <p className="mt-0.5 text-[12px] text-muted">
                  {deal.description}
                </p>
              )}
              {deal.dateStart !== deal.dateEnd && (
                <p className="mt-1 text-[10px] text-violet-500">
                  fino al {formatDateShort(deal.dateEnd)}
                </p>
              )}
            </div>
          </div>
        ))}

      </div>

      <div className="flex items-center justify-between gap-2 px-4 pb-3.5 pt-3">
        <div className="flex min-w-0 items-center gap-2">
          <p className="min-w-0 truncate text-[11px] text-muted/60">{restaurant.address}</p>
          {restaurant.menuUrl && (
            <span className="shrink-0 text-[11px] font-semibold text-accent">Menu</span>
          )}
        </div>
      </div>
    </div>
  );
}
