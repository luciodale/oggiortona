import { useLocale } from "../../../i18n/useLocale";
import type { PromotionRow } from "../../../types/database";
import { formatDateShort } from "../../../utils/date";
import { isPromotionExpired, getBadgeStyle } from "../../../utils/promotionBadge";
import { PromotionCard } from "./PromotionCard";

type PromotionsListProps = {
  items: Array<PromotionRow>;
  onRenew: (id: number) => void;
  onDelete: (id: number) => void;
};

export function PromotionsList({ items, onRenew, onDelete }: PromotionsListProps) {
  const { locale, t } = useLocale();
  const sorted = [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  if (sorted.length === 0) return null;

  return (
    <div className="mt-6 space-y-3">
      {sorted.map((item) => {
        const expired = isPromotionExpired(item);
        const badge = getBadgeStyle(item.type, locale);
        const isMultiDay = item.dateStart !== item.dateEnd;

        return (
          <PromotionCard
            key={item.id}
            expired={expired}
            badge={
              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${badge.cls}`}>
                {badge.label}
              </span>
            }
            onRenew={() => onRenew(item.id)}
            onDelete={() => onDelete(item.id)}
          >
            <p className="text-[13px] font-medium text-primary">{item.title}</p>
            {item.description && (
              <p className="mt-0.5 text-[12px] text-muted">{item.description}</p>
            )}
            <div className="mt-1 flex flex-wrap items-center gap-x-2 text-[11px] text-muted">
              {item.price != null && <span>{item.price.toFixed(2)}&euro;</span>}
              {item.timeStart && item.timeEnd && (
                <span>{item.timeStart} &ndash; {item.timeEnd}</span>
              )}
              {isMultiDay
                ? <span>{t("common.untilDate", { date: formatDateShort(item.dateEnd, locale) })}</span>
                : <span>{formatDateShort(item.dateStart, locale)}</span>}
            </div>
          </PromotionCard>
        );
      })}
    </div>
  );
}
