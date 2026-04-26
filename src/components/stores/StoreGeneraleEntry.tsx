import { MessageIcon } from "../../icons/MessageIcon";
import type { StorePromotionRow } from "../../types/database";
import { TimeRange } from "../restaurants/TimeRange";

type StoreGeneraleEntryProps = {
  item: StorePromotionRow;
};

export function StoreGeneraleEntry({ item }: StoreGeneraleEntryProps) {
  const hasMetadata = item.price != null || item.timeStart || item.timeEnd;

  return (
    <div className="mt-3 flex items-start gap-2 rounded-xl bg-promo-generale-bg px-3 py-2.5">
      <MessageIcon className="mt-px h-3.5 w-3.5 shrink-0 text-promo-generale" strokeWidth={2.5} />
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-promo-generale">
          Generale
        </p>
        <p className="mt-0.5 text-[13px] font-medium text-primary">
          {item.title}
        </p>
        {item.description && (
          <p className="mt-0.5 text-[12px] text-muted">
            {item.description}
          </p>
        )}
        {hasMetadata && (
          <div className="mt-1 flex flex-wrap items-center gap-x-2 text-[11px] text-muted">
            {item.price != null && (
              <span className="font-bold text-promo-generale">
                {item.price.toFixed(2)}&euro;
              </span>
            )}
            <TimeRange timeStart={item.timeStart} timeEnd={item.timeEnd} />
          </div>
        )}
      </div>
    </div>
  );
}
