import { useLocale } from "../../i18n/useLocale";
import { CalendarIcon } from "../../icons/CalendarIcon";
import { ChevronRightIcon } from "../../icons/ChevronRightIcon";
import { PinIcon } from "../../icons/PinIcon";
import type { StoreWithStatus } from "../../types/domain";
import { CardContactButtons } from "../shared/CardContactButtons";
import { StoreDealEntry } from "./StoreDealEntry";
import { StoreGeneraleEntry } from "./StoreGeneraleEntry";
import { StoreNewsEntry } from "./StoreNewsEntry";
import { SaldiEntry } from "./SaldiEntry";

type StoreCardProps = {
  store: StoreWithStatus;
  isPinned: boolean;
  onTogglePin?: (id: number) => void;
  zipperCard?: boolean;
  onCardClick?: (store: StoreWithStatus) => void;
};

export function StoreCard({ store, isPinned, onTogglePin, zipperCard = true, onCardClick }: StoreCardProps) {
  const { t } = useLocale();

  function handlePinClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    onTogglePin?.(store.id);
  }

  function handleClick(e: React.MouseEvent) {
    if (onCardClick) {
      e.preventDefault();
      onCardClick(store);
    }
  }
  const generaleItems = store.promotions.filter((p) => p.type === "generale");
  const saldiItems = store.promotions.filter((p) => p.type === "saldi");
  const deals = store.promotions.filter((p) => p.type === "deal");
  const newsItems = store.promotions.filter((p) => p.type === "news");

  return (
    <div
      className={`${zipperCard ? "zipper-card" : ""} rounded-2xl bg-card shadow-card border-l-[3px] transition-colors duration-200 ${isPinned ? "border-l-accent/40" : "border-l-transparent"} ${onCardClick ? "cursor-pointer" : ""}`}
      onClick={handleClick}
      role={onCardClick ? "button" : undefined}
    >
      <div className="p-4 pb-0">
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
                {store.name}
              </h3>
              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-muted">
                <span className="capitalize">
                  {store.types.join(" · ")}
                </span>
              </div>
            </div>
          </div>
          <span
            className={`mt-0.5 flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
              store.isOpen
                ? "bg-success/10 text-success"
                : "bg-danger/10 text-danger"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                store.isOpen ? "bg-success" : "bg-danger"
              }`}
              aria-hidden="true"
            />
            {store.isOpen ? t("common.open") : t("common.closed")}
          </span>
        </div>

        {store.description && (
          <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-muted">
            {store.description}
          </p>
        )}

        {store.linkedEventCount > 0 && (
          <span className="mt-1.5 flex items-center gap-1 text-[11px] text-fare/70">
            <CalendarIcon className="h-3 w-3" />
            {store.linkedEventCount === 1
              ? t("stores.linkedEventOne")
              : t("stores.linkedEventMany", { count: store.linkedEventCount })}
          </span>
        )}

        {saldiItems.map((saldi) => (
          <SaldiEntry key={saldi.id} saldi={saldi} />
        ))}

        {deals.map((deal) => (
          <StoreDealEntry key={deal.id} deal={deal} />
        ))}

        {newsItems.map((item) => (
          <StoreNewsEntry key={item.id} news={item} />
        ))}

        {generaleItems.map((item) => (
          <StoreGeneraleEntry key={item.id} item={item} />
        ))}

      </div>

      <div className="flex items-end justify-between gap-2 px-4 pb-3.5 pt-3">
        <CardContactButtons
          phone={store.phone}
          name={store.name}
          latitude={store.latitude}
          longitude={store.longitude}
        />
        {onCardClick && (
          <span className="flex shrink-0 items-center gap-0.5 text-[11px] font-semibold text-accent">
            {t("common.details")}
            <ChevronRightIcon className="h-3.5 w-3.5" />
          </span>
        )}
      </div>
    </div>
  );
}
