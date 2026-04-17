import { ZapIcon } from "../../icons/ZapIcon";
import type { PromotionRow, StorePromotionRow } from "../../types/database";
import { DateRange } from "./DateRange";
import { TimeRange } from "./TimeRange";

type DealEntryProps = {
  deal: PromotionRow | StorePromotionRow;
};

export function DealEntry({ deal }: DealEntryProps) {
  const hasTimeDateInfo =
    deal.timeStart || deal.timeEnd || deal.dateStart !== deal.dateEnd;

  return (
    <div className="mt-3 flex items-start gap-2 rounded-xl bg-promo-deal-bg px-3 py-2.5">
      <ZapIcon className="mt-px h-3.5 w-3.5 shrink-0 text-promo-deal" strokeWidth={2.5} />
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wide text-promo-deal">
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
        {hasTimeDateInfo && (
          <div className="mt-1 flex flex-wrap items-center gap-x-2 text-[11px] text-muted">
            <TimeRange timeStart={deal.timeStart} timeEnd={deal.timeEnd} />
            <DateRange
              dateStart={deal.dateStart}
              dateEnd={deal.dateEnd}
              className="text-[10px] text-promo-deal/70"
            />
          </div>
        )}
      </div>
    </div>
  );
}
