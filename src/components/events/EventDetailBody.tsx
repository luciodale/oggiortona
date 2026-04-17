import { useSwipeBarContext } from "@luciodale/swipe-bar";
import { useLocale } from "../../i18n/useLocale";
import { eventCategoryColors, eventCategoryLabels } from "../../config/categories";
import { formatDateLong } from "../../utils/date";
import { CalendarIcon } from "../../icons/CalendarIcon";
import { ClockIcon } from "../../icons/ClockIcon";
import { CupIcon } from "../../icons/CupIcon";
import { ShopIcon } from "../../icons/ShopIcon";
import { TagIcon } from "../../icons/TagIcon";
import { EventLink } from "./EventLink";
import type { EventWithRestaurant, SheetMeta, RestaurantWithStatus, StoreWithStatus } from "../../types/domain";

type ActionLinkProps = {
  href: string;
  label: string;
  color: string;
  external?: boolean;
};

function ActionLink({ href, label, color, external }: ActionLinkProps) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-[13px] font-semibold no-underline transition-all active:scale-[0.98] ${color}`}
    >
      {label}
    </a>
  );
}

type EventDetailBodyProps = {
  event: EventWithRestaurant;
};

export function EventDetailBody({ event }: EventDetailBodyProps) {
  const { locale, t } = useLocale();
  const { openSidebar } = useSwipeBarContext();

  function handleRestaurantClick() {
    fetch(`/api/restaurants/${event.restaurantId}`)
      .then((r) => r.json())
      .then((data: { restaurant: RestaurantWithStatus }) => {
        const meta: SheetMeta = { kind: "restaurant", data: data.restaurant };
        openSidebar("bottom", { id: "linked", meta });
      });
  }

  function handleStoreClick() {
    fetch(`/api/stores/${event.storeId}`)
      .then((r) => r.json())
      .then((data: { store: StoreWithStatus }) => {
        const meta: SheetMeta = { kind: "store", data: data.store };
        openSidebar("bottom", { id: "linked", meta });
      });
  }
  const categories = event.category.split(",").map((c: string) => c.trim());
  const catLabels = eventCategoryLabels(locale);

  return (
    <>
      <div className="flex flex-wrap gap-1">
        {categories.map((cat: string) => (
          <span key={cat} className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${eventCategoryColors[cat] ?? "bg-cat-altro-bg text-cat-altro"}`}>
            {catLabels[cat] ?? cat}
          </span>
        ))}
      </div>

      <h1 className="mt-3 font-family-display text-2xl font-medium leading-tight text-primary">{event.title}</h1>

      <div className="mt-5 space-y-3 rounded-2xl bg-card p-4 shadow-card">
        <div className="flex items-center gap-3 text-[13px] text-primary">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-fare-light">
            <CalendarIcon className="h-4 w-4 text-fare" />
          </div>
          <div>
            <span className="capitalize">{formatDateLong(event.dateStart, locale)}</span>
            {event.dateEnd && <span> &ndash; <span className="capitalize">{formatDateLong(event.dateEnd, locale)}</span></span>}
          </div>
        </div>
        {event.timeStart && (
          <div className="flex items-center gap-3 text-[13px] text-primary">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-fare-light">
              <ClockIcon className="h-4 w-4 text-fare" />
            </div>
            <span>{event.timeStart}{event.timeEnd && ` \u2013 ${event.timeEnd}`}</span>
          </div>
        )}
        {event.price != null && (
          <div className="flex items-center gap-3 text-[13px] text-primary">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-fare-light">
              <TagIcon className="h-4 w-4 text-fare" />
            </div>
            <span className="font-medium">{event.price.toFixed(2)}&euro;</span>
          </div>
        )}
      </div>

      <div className="mt-5 flex gap-2">
        {event.phone && (
          <ActionLink
            href={`https://wa.me/${event.phone.replace(/[\s\-+()]/g, "")}?text=${encodeURIComponent(t("aria.whatsappMessage"))}`}
            label={t("common.whatsapp")}
            color="bg-[#25D366] text-white hover:bg-[#1FAD55]"
            external
          />
        )}
        {event.latitude != null && event.longitude != null && (
          <ActionLink
            href={`https://www.google.com/maps/search/?api=1&query=${event.latitude},${event.longitude}`}
            label={t("common.directions")}
            color="bg-primary text-card hover:bg-primary/90"
            external
          />
        )}
        {event.phone && (
          <ActionLink
            href={`tel:${event.phone}`}
            label={t("common.call")}
            color="border border-border bg-card text-primary hover:bg-surface-alt"
          />
        )}
      </div>

      {event.link && <EventLink href={event.link} className="mt-4 inline-flex text-[13px] font-semibold" />}

      {event.restaurantName && event.restaurantId && (
        <button
          type="button"
          onClick={handleRestaurantClick}
          className="mt-5 flex w-full items-center gap-3 rounded-2xl bg-card p-4 text-left shadow-card"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-mangiare-light">
            <CupIcon className="h-4 w-4 text-mangiare" />
          </div>
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">
              {t("events.linkedVenue")}
            </span>
            <p className="text-[13px] font-medium text-primary">{event.restaurantName}</p>
          </div>
        </button>
      )}

      {event.storeName && event.storeId && (
        <button
          type="button"
          onClick={handleStoreClick}
          className="mt-3 flex w-full items-center gap-3 rounded-2xl bg-card p-4 text-left shadow-card"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-mangiare-light">
            <ShopIcon className="h-4 w-4 text-mangiare" />
          </div>
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">
              {t("events.linkedStore")}
            </span>
            <p className="text-[13px] font-medium text-primary">{event.storeName}</p>
          </div>
        </button>
      )}

      {event.description && (
        <div className="mt-6">
          <h2 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">{t("common.details")}</h2>
          <p className="whitespace-pre-line text-[13px] leading-relaxed text-muted">{event.description}</p>
        </div>
      )}

      <div className="mt-8">
        <h2 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">{t("common.address")}</h2>
        <p className="text-[13px] text-primary">{event.address}</p>
      </div>
    </>
  );
}
