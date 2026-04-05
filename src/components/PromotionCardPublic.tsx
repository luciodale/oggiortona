import { useLocale } from "../i18n/useLocale";
import type { PromotionRow } from "../types/database";
import { formatDateShort } from "../utils/date";

type Style = { bg: string; label: string; labelColor: string };

export function PromotionCardPublic({ item }: { item: PromotionRow }) {
  const { t, locale } = useLocale();
  const isMultiDay = item.dateStart !== item.dateEnd;

  const fallback: Style = { bg: "bg-promo-generale-bg", label: t("promo.generale"), labelColor: "text-promo-generale" };
  const styleMap: Record<string, Style> = {
    generale: fallback,
    special: { bg: "bg-mangiare-light", label: t("promo.dailySpecial"), labelColor: "text-mangiare" },
    deal: { bg: "bg-promo-deal-bg", label: t("promo.deal"), labelColor: "text-promo-deal" },
    news: { bg: "bg-promo-news-bg", label: t("promo.news"), labelColor: "text-promo-news" },
  };
  const style: Style = styleMap[item.type] ?? fallback;

  return (
    <div className={`rounded-2xl p-4 ${style.bg}`}>
      <p className={`text-[10px] font-semibold uppercase tracking-[0.12em] ${style.labelColor}`}>
        {style.label}
      </p>
      <p className="mt-1.5 font-family-display text-base font-medium text-primary">
        {item.title}
      </p>
      {item.description && (
        <p className="mt-0.5 text-[12px] text-muted">{item.description}</p>
      )}
      <div className="mt-1 flex flex-wrap items-center gap-x-2 text-[11px] text-muted">
        {item.price != null && (
          <span className={`font-bold ${style.labelColor}`}>
            {item.price.toFixed(2)}&euro;
          </span>
        )}
        {item.timeStart && item.timeEnd && (
          <span>{item.timeStart} &ndash; {item.timeEnd}</span>
        )}
        {isMultiDay && (
          <span>{t("common.untilDate", { date: formatDateShort(item.dateEnd, locale) })}</span>
        )}
      </div>
    </div>
  );
}
