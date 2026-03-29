import type { PromotionRow } from "../../types/database";
import { DateRange } from "./DateRange";
import { TimeRange } from "./TimeRange";

type DealEntryProps = {
  deal: PromotionRow;
};

export function DealEntry({ deal }: DealEntryProps) {
  const hasTimeDateInfo =
    deal.timeStart || deal.timeEnd || deal.dateStart !== deal.dateEnd;

  return (
    <div className="mt-3 flex items-start gap-2 rounded-xl bg-violet-50 px-3 py-2.5">
      <span className="mt-px text-sm" aria-hidden="true">&#9889;</span>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wide text-violet-700">
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
              className="text-[10px] text-violet-500"
            />
          </div>
        )}
      </div>
    </div>
  );
}
