import { StarIcon } from "../../icons/StarIcon";
import type { PromotionRow } from "../../types/database";
import { DateRange } from "./DateRange";
import { TimeRange } from "./TimeRange";

type SpecialEntryProps = {
  special: PromotionRow;
};

export function SpecialEntry({ special }: SpecialEntryProps) {
  const hasTimeDateInfo =
    special.timeStart || special.timeEnd || special.dateStart !== special.dateEnd;

  return (
    <div className="mt-3 flex items-start gap-2 rounded-xl bg-mangiare-light px-3 py-2.5">
      <StarIcon className="mt-px h-3.5 w-3.5 shrink-0 text-mangiare" strokeWidth={2.5} />
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wide text-mangiare">
          Piatto del giorno
        </p>
        <p className="mt-0.5 text-[13px] text-primary">
          {special.title}
          {special.price != null && (
            <span className="ml-1 font-semibold">
              {special.price.toFixed(2)}&euro;
            </span>
          )}
        </p>
        {hasTimeDateInfo && (
          <div className="mt-1 flex flex-wrap items-center gap-x-2 text-[11px] text-muted">
            <TimeRange timeStart={special.timeStart} timeEnd={special.timeEnd} />
            <DateRange
              dateStart={special.dateStart}
              dateEnd={special.dateEnd}
              className="text-[10px] text-mangiare"
            />
          </div>
        )}
      </div>
    </div>
  );
}
