import { useLocale } from "../../i18n/useLocale";
import { restaurantTypeLabels } from "../../config/categories";
import { PromotionCardPublic } from "../PromotionCardPublic";
import { formatSchedule, getDayLabel, getOrderedDays } from "../../utils/time";
import type { RestaurantWithStatus } from "../../types/domain";
import type { PromotionRow } from "../../types/database";

type RestaurantDetailBodyProps = {
  restaurant: RestaurantWithStatus;
};

export function RestaurantDetailBody({ restaurant }: RestaurantDetailBodyProps) {
  const { locale, t } = useLocale();
  const labels = restaurantTypeLabels(locale);
  const days = getOrderedDays();

  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-family-display text-2xl font-medium leading-tight text-primary">{restaurant.name}</h1>
          <div className="mt-1 flex items-center gap-2 text-[11px] text-muted">
            <span className="capitalize">{restaurant.types.map((tp) => labels[tp] ?? tp).join(" \u00b7 ")}</span>
            <span aria-hidden="true">&middot;</span>
            <span aria-label={t("aria.priceRange", { range: restaurant.priceRange })}>
              {[1, 2, 3].map((i) => (
                <span key={i} aria-hidden="true" className={i <= restaurant.priceRange ? "text-primary" : "text-border"}>&euro;</span>
              ))}
            </span>
          </div>
        </div>
        <span className={`mt-1 flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${restaurant.isOpen ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${restaurant.isOpen ? "bg-success" : "bg-danger"}`} aria-hidden="true" />
          {restaurant.isOpen ? t("common.open") : t("common.closed")}
        </span>
      </div>

      {restaurant.description && <p className="mt-3 text-[13px] leading-relaxed text-muted">{restaurant.description}</p>}

      <div className="mt-5 flex gap-2">
        {restaurant.phone && (
          <a href={`https://wa.me/${restaurant.phone.replace(/[\s\-+()]/g, "")}?text=${encodeURIComponent(t("aria.whatsappMessage"))}`} target="_blank" rel="noopener noreferrer" className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-[13px] font-semibold text-white no-underline transition-all hover:bg-[#1FAD55] active:scale-[0.98]">{t("common.whatsapp")}</a>
        )}
        <a href={restaurant.latitude != null && restaurant.longitude != null ? `https://www.google.com/maps/search/?api=1&query=${restaurant.latitude},${restaurant.longitude}` : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.address)}`} target="_blank" rel="noopener noreferrer" className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3 text-[13px] font-semibold text-card no-underline transition-all hover:bg-primary/90 active:scale-[0.98]">{t("common.directions")}</a>
        {restaurant.phone && (
          <a href={`tel:${restaurant.phone}`} className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-[13px] font-semibold text-primary no-underline transition-all hover:bg-surface-alt active:scale-[0.98]">{t("common.call")}</a>
        )}
        {restaurant.menuUrl && (
          <a href={restaurant.menuUrl} target="_blank" rel="noopener noreferrer" className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-[13px] font-semibold text-primary no-underline transition-all hover:bg-surface-alt active:scale-[0.98]">{t("common.menu")}</a>
        )}
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {restaurant.promotions.map((p: PromotionRow) => <PromotionCardPublic key={p.id} item={p} />)}
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">{t("common.hours")}</h2>
        <div className="rounded-2xl bg-card shadow-card">
          {days.map((day, i) => {
            const schedule = restaurant.parsedHours[day];
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
        <p className="text-[13px] text-primary">{restaurant.address}</p>
      </div>
    </>
  );
}
