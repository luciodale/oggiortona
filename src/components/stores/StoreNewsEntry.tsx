import { StarIcon } from "../../icons/StarIcon";
import type { StorePromotionRow } from "../../types/database";
import { TimeRange } from "../restaurants/TimeRange";

type StoreNewsEntryProps = {
  news: StorePromotionRow;
};

export function StoreNewsEntry({ news }: StoreNewsEntryProps) {
  const hasMetadata = news.price != null || news.timeStart || news.timeEnd;

  return (
    <div className="mt-3 flex items-start gap-2 rounded-xl bg-promo-news-bg px-3 py-2.5">
      <StarIcon className="mt-px h-3.5 w-3.5 shrink-0 text-promo-news" strokeWidth={2.5} />
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-promo-news">
          News
        </p>
        <p className="mt-0.5 text-[13px] font-medium text-primary">
          {news.title}
        </p>
        {news.description && (
          <p className="mt-0.5 text-[12px] text-muted">
            {news.description}
          </p>
        )}
        {hasMetadata && (
          <div className="mt-1 flex flex-wrap items-center gap-x-2 text-[11px] text-muted">
            {news.price != null && (
              <span className="font-bold text-promo-news">
                {news.price.toFixed(2)}&euro;
              </span>
            )}
            <TimeRange timeStart={news.timeStart} timeEnd={news.timeEnd} />
          </div>
        )}
      </div>
    </div>
  );
}
