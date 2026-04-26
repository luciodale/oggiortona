import { ZapIcon } from "../../icons/ZapIcon";
import type { StorePromotionRow } from "../../types/database";
import { TimeRange } from "../restaurants/TimeRange";

type StoreDealEntryProps = {
  deal: StorePromotionRow;
};

export function StoreDealEntry({ deal }: StoreDealEntryProps) {
  const hasTimeDateInfo = deal.timeStart || deal.timeEnd;

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
          </div>
        )}
      </div>
    </div>
  );
}
