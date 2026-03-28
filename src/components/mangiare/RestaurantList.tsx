import { useRef } from "react";
import type { RestaurantWithStatus } from "../../types/domain";
import { useRestaurantFilters } from "../../hooks/useRestaurantFilters";
import { useZipperScroll } from "../../hooks/useZipperScroll";
import { restaurantTypeLabels } from "../../config/categories";
import { formatUtcAsItalianTime } from "../../utils/time";
import { MessageIcon } from "../../icons/MessageIcon";
import { MapPinIcon } from "../../icons/MapPinIcon";
import { PhoneIcon } from "../../icons/PhoneIcon";
import { IconBubble } from "../shared/IconBubble";

type RestaurantListProps = {
  restaurants: Array<RestaurantWithStatus>;
};

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.04em] transition-all ${
        active
          ? "bg-primary text-white shadow-sm"
          : "bg-surface-warm text-muted hover:text-primary"
      }`}
    >
      {children}
    </button>
  );
}

function RestaurantCard({ restaurant }: { restaurant: RestaurantWithStatus }) {
  return (
    <div className="zipper-card rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <a
        href={`/mangiare/${restaurant.id}`}
        className="block p-4 pb-0 no-underline"
      >
        {/* Top row: name + status */}
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
              <span aria-label={`Fascia di prezzo: ${restaurant.price_range} su 3`}>
                {Array.from({ length: 3 }, (_, i) => (
                  <span key={i} className={i < restaurant.price_range ? "text-primary" : "text-border"}>
                    &euro;
                  </span>
                ))}
              </span>
            </div>
          </div>
          <span
            className={`mt-0.5 flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
              restaurant.is_open
                ? "bg-success/10 text-success"
                : "bg-danger/10 text-danger"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                restaurant.is_open ? "bg-success" : "bg-danger"
              }`}
              aria-hidden="true"
            />
            {restaurant.is_open ? "Aperto" : "Chiuso"}
          </span>
        </div>

        {/* Description */}
        {restaurant.description && (
          <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-muted">
            {restaurant.description}
          </p>
        )}

        {/* Daily special */}
        {restaurant.today_special && (
          <div className="mt-3 flex items-start gap-2 rounded-xl bg-mangiare-light px-3 py-2.5">
            <span className="mt-px text-sm" aria-hidden="true">&#9733;</span>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-mangiare">
                Piatto del giorno
              </p>
              <p className="mt-0.5 text-[13px] text-primary">
                {restaurant.today_special.description}
                {restaurant.today_special.price != null && (
                  <span className="ml-1 font-semibold">
                    {restaurant.today_special.price.toFixed(2)}&euro;
                  </span>
                )}
              </p>
            </div>
          </div>
        )}

        {/* Deal */}
        {restaurant.active_deal && (
          <div className="mt-3 flex items-start gap-2 rounded-xl bg-violet-50 px-3 py-2.5">
            <span className="mt-px text-sm" aria-hidden="true">&#9889;</span>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-violet-700">
                Offerta
              </p>
              <p className="mt-0.5 text-[13px] font-medium text-primary">
                {restaurant.active_deal.title}
              </p>
              {restaurant.active_deal.description && (
                <p className="mt-0.5 text-[12px] text-muted">
                  {restaurant.active_deal.description}
                </p>
              )}
              <p className="mt-1 text-[10px] text-violet-500">
                Valida fino alle {formatUtcAsItalianTime(restaurant.active_deal.valid_until)}
              </p>
            </div>
          </div>
        )}
      </a>

      {/* Bottom bar: address + action buttons */}
      <div className="flex items-center justify-between gap-2 px-4 pb-3.5 pt-3">
        <p className="min-w-0 truncate text-[11px] text-muted/60">{restaurant.address}</p>
        <div className="flex shrink-0 items-center gap-1.5">
          {restaurant.phone && (
            <IconBubble
              href={`https://wa.me/${restaurant.phone.replace(/[\s\-+()]/g, "")}?text=${encodeURIComponent("Ciao, vi ho trovato su Oggi a Ortona!")}`}
              label={`Scrivi su WhatsApp a ${restaurant.name}`}
              external
            >
              <MessageIcon className="h-3.5 w-3.5" />
            </IconBubble>
          )}
          {restaurant.google_maps_url && (
            <IconBubble
              href={restaurant.google_maps_url}
              label={`Indicazioni per ${restaurant.name}`}
              external
            >
              <MapPinIcon className="h-3.5 w-3.5" />
            </IconBubble>
          )}
          {restaurant.phone && (
            <IconBubble
              href={`tel:${restaurant.phone}`}
              label={`Chiama ${restaurant.name}`}
            >
              <PhoneIcon className="h-3.5 w-3.5" />
            </IconBubble>
          )}
        </div>
      </div>
    </div>
  );
}

export function RestaurantList({ restaurants }: RestaurantListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  useZipperScroll(containerRef);

  const { filters, filtered, toggleOpenNow, toggleHasSpecial, toggleHasDeals } =
    useRestaurantFilters(restaurants);

  const specialCount = restaurants.filter((r) => r.today_special !== null).length;
  const dealCount = restaurants.filter((r) => r.active_deal !== null).length;

  return (
    <div ref={containerRef}>
      {/* Filters */}
      <div className="scroll-hide -mx-5 flex gap-2 overflow-x-auto px-5 pb-1" role="toolbar" aria-label="Filtri">
        <FilterChip active={filters.openNow} onClick={toggleOpenNow}>
          Aperto ora
        </FilterChip>
        <FilterChip active={filters.hasSpecial} onClick={toggleHasSpecial}>
          {specialCount > 0 ? `Piatto del giorno (${specialCount})` : "Piatto del giorno"}
        </FilterChip>
        <FilterChip active={filters.hasDeals} onClick={toggleHasDeals}>
          {dealCount > 0 ? `Offerte (${dealCount})` : "Offerte"}
        </FilterChip>
      </div>

      {/* Count */}
      <p className="mb-4 mt-5 text-[11px] font-medium uppercase tracking-[0.1em] text-muted">
        {filtered.length} {filtered.length === 1 ? "locale" : "locali"}
      </p>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="font-[family-name:var(--font-family-display)] text-lg italic text-muted/50">
            Nessun risultato
          </p>
          <p className="mt-1 text-xs text-muted/40">Prova a cambiare i filtri</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      )}
    </div>
  );
}
