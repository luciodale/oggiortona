import { restaurantTypeLabels } from "../../config/categories";
import { useLocale } from "../../i18n/useLocale";
import { PinIcon } from "../../icons/PinIcon";
import type { RestaurantWithStatus } from "../../types/domain";
import { CardContactButtons } from "../shared/CardContactButtons";
import { DealEntry } from "./DealEntry";
import { NewsEntry } from "./NewsEntry";
import { SpecialEntry } from "./SpecialEntry";

type RestaurantCardProps = {
  restaurant: RestaurantWithStatus;
  isPinned: boolean;
  onTogglePin?: (id: number) => void;
  zipperCard?: boolean;
  onCardClick?: (restaurant: RestaurantWithStatus) => void;
};

export function RestaurantCard({ restaurant, isPinned, onTogglePin, zipperCard = true, onCardClick }: RestaurantCardProps) {
  const { locale, t } = useLocale();

  function handlePinClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    onTogglePin?.(restaurant.id);
  }

  function handleClick(e: React.MouseEvent) {
    if (onCardClick) {
      e.preventDefault();
      onCardClick(restaurant);
    }
  }
  const labels = restaurantTypeLabels(locale);
  const specials = restaurant.promotions.filter((p) => p.type === "special");
  const deals = restaurant.promotions.filter((p) => p.type === "deal");
  const newsItems = restaurant.promotions.filter((p) => p.type === "news");

  return (
    <div
      className={`${zipperCard ? "zipper-card" : ""} rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] border-l-[3px] transition-colors duration-200 ${isPinned ? "border-l-accent/40" : "border-l-transparent"} ${onCardClick ? "cursor-pointer" : ""}`}
      onClick={handleClick}
      role={onCardClick ? "button" : undefined}
    >
      <a
        href={onCardClick ? undefined : `/restaurants/${restaurant.id}`}
        className="block p-4 pb-0 no-underline"
      >
        {/* Top row: name + status */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-1 items-start gap-1">
            {onTogglePin && (
              <button
                type="button"
                onClick={handlePinClick}
                aria-pressed={isPinned}
                aria-label={isPinned ? t("pin.unpin") : t("pin.pin")}
                className={`-ml-1.5 -mt-px flex size-7 shrink-0 items-center justify-center rounded-full transition-all duration-200 ${
                  isPinned
                    ? "bg-accent/10 text-accent"
                    : "text-muted/50 hover:text-muted/70"
                }`}
              >
                <PinIcon className="h-4 w-4" strokeWidth={isPinned ? 2.5 : 2} />
              </button>
            )}
            <div className="min-w-0">
              <h3 className="font-family-display text-lg font-medium leading-tight text-primary">
                {restaurant.name}
              </h3>
              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-muted">
                <span className="capitalize">
                  {restaurant.types
                    .map((tp) => labels[tp] ?? tp)
                    .join(" · ")}
                </span>
                <span aria-hidden="true">&middot;</span>
                <span aria-label={t("aria.priceRange", { range: restaurant.priceRange })}>
                  {Array.from({ length: 3 }, (_, i) => (
                    <span key={i} className={i < restaurant.priceRange ? "text-primary" : "text-border"}>
                      &euro;
                    </span>
                  ))}
                </span>
              </div>
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
            {restaurant.isOpen ? t("common.open") : t("common.closed")}
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
              aria-label={t("aria.menuOf", { name: restaurant.name })}
              onClick={(e) => e.stopPropagation()}
            >
              {t("common.menu")}
            </a>
          )}
        </div>
        <CardContactButtons
          phone={restaurant.phone}
          name={restaurant.name}
          address={restaurant.address}
          latitude={restaurant.latitude}
          longitude={restaurant.longitude}
        />
      </div>
    </div>
  );
}
