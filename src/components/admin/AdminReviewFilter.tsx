export type ReviewFilter = "pending" | "reviewed" | "ai_scraper";

type AdminReviewFilterProps = {
  value: ReviewFilter;
  onChange: (value: ReviewFilter) => void;
  showAiScraper?: boolean;
};

export function AdminReviewFilter({ value, onChange, showAiScraper }: AdminReviewFilterProps) {
  return (
    <div className="flex gap-1.5">
      <button
        type="button"
        onClick={() => onChange("pending")}
        className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-colors ${
          value === "pending"
            ? "bg-status-pending-bg text-status-pending"
            : "text-muted hover:text-primary"
        }`}
      >
        Da revisionare
      </button>
      <button
        type="button"
        onClick={() => onChange("reviewed")}
        className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-colors ${
          value === "reviewed"
            ? "bg-accent/10 text-accent"
            : "text-muted hover:text-primary"
        }`}
      >
        Revisionati
      </button>
      {showAiScraper && (
        <button
          type="button"
          onClick={() => onChange("ai_scraper")}
          className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-colors ${
            value === "ai_scraper"
              ? "bg-promo-deal-bg text-promo-deal"
              : "text-muted hover:text-primary"
          }`}
        >
          Auto-generati
        </button>
      )}
    </div>
  );
}
