import { restaurantTypeLabels } from "../../config/categories";
import { MapPinIcon } from "../../icons/MapPinIcon";
import { MessageIcon } from "../../icons/MessageIcon";
import { PhoneIcon } from "../../icons/PhoneIcon";
import type { RestaurantWithStatus } from "../../types/domain";
import { IconBubble } from "../shared/IconBubble";
import { DealEntry } from "./DealEntry";
import { NewsEntry } from "./NewsEntry";
import { SpecialEntry } from "./SpecialEntry";

type RestaurantCardProps = {
  restaurant: RestaurantWithStatus;
};

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const specials = restaurant.promotions.filter((p) => p.type === "special");
  const deals = restaurant.promotions.filter((p) => p.type === "deal");
  const newsItems = restaurant.promotions.filter((p) => p.type === "news");

  return (
    <div className="zipper-card rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <a
        href={`/restaurants/${restaurant.id}`}
        className="block p-4 pb-0 no-underline"
      >
        {/* Top row: name + status */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-family-display text-lg font-medium leading-tight text-primary">
              {restaurant.name}
            </h3>
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-muted">
              <span className="capitalize">
                {restaurant.types
                  .map((t) => restaurantTypeLabels[t] ?? t)
                  .join(" · ")}
              </span>
              <span aria-hidden="true">&middot;</span>
              <span aria-label={`Fascia di prezzo: ${restaurant.priceRange} su 3`}>
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

        {/* Description */}
        {restaurant.description && (
          <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-muted">
            {restaurant.description}
          </p>
        )}

        {specials.map((special) => (
          <SpecialEntry key={special.id} special={special} />
        ))}

        {deals.map((deal) => (
          <DealEntry key={deal.id} deal={deal} />
        ))}

        {newsItems.map((item) => (
          <NewsEntry key={item.id} news={item} />
        ))}

      </a>

      {/* Bottom bar: address + action buttons */}
      <div className="flex items-center justify-between gap-2 px-4 pb-3.5 pt-3">
        <div className="flex min-w-0 items-center gap-2">
          <p className="min-w-0 truncate text-[11px] text-muted/60">{restaurant.address}</p>
          {restaurant.menuUrl && (
            <a
              href={restaurant.menuUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-[11px] font-semibold text-accent no-underline"
              aria-label={`Menu di ${restaurant.name}`}
              onClick={(e) => e.stopPropagation()}
            >
              Menu
            </a>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {restaurant.phone && (
            <IconBubble
              href={`https://wa.me/${restaurant.phone.replace(/[\s\-+()]/g, "")}?text=${encodeURIComponent("Da Oggi a Ortona, messaggio:")}`}
              label={`Scrivi su WhatsApp a ${restaurant.name}`}
              external
            >
              <MessageIcon className="h-3.5 w-3.5" />
            </IconBubble>
          )}
          <IconBubble
            href={
              restaurant.latitude != null && restaurant.longitude != null
                ? `https://www.google.com/maps/search/?api=1&query=${restaurant.latitude},${restaurant.longitude}`
                : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.address)}`
            }
            label={`Indicazioni per ${restaurant.name}`}
            external
          >
            <MapPinIcon className="h-3.5 w-3.5" />
          </IconBubble>
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
