import { useSwipeBarContext } from "@luciodale/swipe-bar";
import { useQuery } from "@tanstack/react-query";
import { useLocale } from "../../i18n/useLocale";
import { eventCategoryColors, eventCategoryLabels } from "../../config/categories";
import { StorePromotionCardPublic } from "../StorePromotionCardPublic";
import { formatSchedule, getDayLabel, getOrderedDays } from "../../utils/time";
import { formatDateShort } from "../../utils/date";
import type { StoreWithStatus, SheetMeta, EventWithRestaurant } from "../../types/domain";
import type { EventRow, StorePromotionRow } from "../../types/database";

type StoreDetailBodyProps = {
  store: StoreWithStatus;
};

export function StoreDetailBody({ store }: StoreDetailBodyProps) {
  const { locale, t } = useLocale();
  const { openSidebar } = useSwipeBarContext();
  const catLabels = eventCategoryLabels(locale);
  const days = getOrderedDays();
  const { data: eventsData } = useQuery<{ events: Array<EventRow> }>({
    queryKey: ["store-events", String(store.id)],
    queryFn: () => fetch(`/api/stores/${store.id}/events`).then((r) => r.json()),
  });
  const linkedEvents = eventsData?.events ?? [];

  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-family-display text-2xl font-medium leading-tight text-primary">{store.name}</h1>
          <div className="mt-1 flex items-center gap-2 text-[11px] text-muted">
            <span className="capitalize">{store.types.join(" \u00b7 ")}</span>
          </div>
        </div>
        <span className={`mt-1 flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${store.isOpen ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${store.isOpen ? "bg-success" : "bg-danger"}`} aria-hidden="true" />
          {store.isOpen ? t("common.open") : t("common.closed")}
        </span>
      </div>

      {store.description && <p className="mt-3 whitespace-pre-line text-[13px] leading-relaxed text-muted">{store.description}</p>}

      {linkedEvents.length > 0 && (
        <div className="mt-5">
          <h2 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">{t("stores.upcomingEvents")}</h2>
          <div className="space-y-2">
            {linkedEvents.map((event) => {
              const cats = event.category.split(",").map((c) => c.trim());
              function handleEventClick() {
                const enriched: EventWithRestaurant = { ...event, restaurantName: null, storeName: store.name };
                const meta: SheetMeta = { kind: "event", data: enriched };
                openSidebar("bottom", { id: "linked", meta });
              }
              return (
                <button
                  type="button"
                  key={event.id}
                  onClick={handleEventClick}
                  className="flex w-full items-center justify-between rounded-xl bg-card p-3 text-left shadow-card"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap gap-1">
                      {cats.map((cat) => (
                        <span key={cat} className={`inline-block rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${eventCategoryColors[cat] ?? eventCategoryColors["altro"]}`}>
                          {catLabels[cat] ?? cat}
                        </span>
                      ))}
                    </div>
                    <p className="mt-1 text-[13px] font-medium leading-snug text-primary">{event.title}</p>
                    <p className="mt-0.5 text-[11px] capitalize text-muted">{formatDateShort(event.dateStart, locale)}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-5 flex gap-2">
        {store.phone && (
          <a href={`https://wa.me/${store.phone.replace(/[\s\-+()]/g, "")}?text=${encodeURIComponent(t("aria.whatsappMessage"))}`} target="_blank" rel="noopener noreferrer" className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-[13px] font-semibold text-white no-underline transition-all hover:bg-[#1FAD55] active:scale-[0.98]">{t("common.whatsapp")}</a>
        )}
        <a href={store.latitude != null && store.longitude != null ? `https://www.google.com/maps/search/?api=1&query=${store.latitude},${store.longitude}` : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}`} target="_blank" rel="noopener noreferrer" className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3 text-[13px] font-semibold text-card no-underline transition-all hover:bg-primary/90 active:scale-[0.98]">{t("common.directions")}</a>
        {store.phone && (
          <a href={`tel:${store.phone}`} className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-[13px] font-semibold text-primary no-underline transition-all hover:bg-surface-alt active:scale-[0.98]">{t("common.call")}</a>
        )}
        {store.storeUrl && (
          <a href={store.storeUrl} target="_blank" rel="noopener noreferrer" className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-[13px] font-semibold text-primary no-underline transition-all hover:bg-surface-alt active:scale-[0.98]">{t("common.link")}</a>
        )}
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {store.promotions.map((p: StorePromotionRow) => <StorePromotionCardPublic key={p.id} item={p} />)}
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">{t("common.hours")}</h2>
        <div className="rounded-2xl bg-card shadow-card">
          {days.map((day, i) => {
            const schedule = store.parsedHours[day];
            return (
              <div key={day} className={`flex items-center justify-between px-4 py-3 ${i < days.length - 1 ? "border-b border-border-light" : ""}`}>
                <span className="text-[13px] font-medium text-primary">{getDayLabel(day, locale)}</span>
                <span className={`text-[13px] ${schedule ? "text-muted" : "text-danger/60"}`}>{formatSchedule(schedule, locale)}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">{t("common.address")}</h2>
        <p className="text-[13px] text-primary">{store.address}</p>
      </div>
    </>
  );
}
