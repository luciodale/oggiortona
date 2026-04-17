import { TagIcon } from "../../icons/TagIcon";
import type { StorePromotionRow } from "../../types/database";
import { DateRange } from "../restaurants/DateRange";
import { TimeRange } from "../restaurants/TimeRange";

type SaldiEntryProps = {
  saldi: StorePromotionRow;
};

export function SaldiEntry({ saldi }: SaldiEntryProps) {
  const hasTimeDateInfo =
    saldi.timeStart || saldi.timeEnd || saldi.dateStart !== saldi.dateEnd;

  return (
    <div className="mt-3 flex items-start gap-2 rounded-xl bg-promo-saldi-bg px-3 py-2.5">
      <TagIcon className="mt-px h-3.5 w-3.5 shrink-0 text-promo-saldi" strokeWidth={2.5} />
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wide text-promo-saldi">
          Saldi
        </p>
        <p className="mt-0.5 text-[13px] text-primary">
          {saldi.title}
          {saldi.price != null && (
            <span className="ml-1 font-semibold">
              {saldi.price.toFixed(2)}&euro;
            </span>
          )}
        </p>
        {hasTimeDateInfo && (
          <div className="mt-1 flex flex-wrap items-center gap-x-2 text-[11px] text-muted">
            <TimeRange timeStart={saldi.timeStart} timeEnd={saldi.timeEnd} />
            <DateRange
              dateStart={saldi.dateStart}
              dateEnd={saldi.dateEnd}
              className="text-[10px] text-promo-saldi"
            />
          </div>
        )}
      </div>
    </div>
  );
}
