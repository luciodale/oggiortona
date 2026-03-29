import { useLocale } from "../../i18n/useLocale";

type ViewMode = "list" | "map";

type ViewToggleProps = {
  mode: ViewMode;
  onToggle: (m: ViewMode) => void;
};

export function ViewToggle({ mode, onToggle }: ViewToggleProps) {
  const { t } = useLocale();

  return (
    <div className="flex shrink-0 rounded-xl bg-surface-warm p-0.5" role="tablist" aria-label={t("ui.view")}>
      <button
        type="button"
        role="tab"
        aria-selected={mode === "list"}
        onClick={() => onToggle("list")}
        className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide transition-all ${
          mode === "list" ? "bg-white text-primary shadow-sm" : "text-muted"
        }`}
      >
        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
        {t("ui.list")}
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={mode === "map"}
        onClick={() => onToggle("map")}
        className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide transition-all ${
          mode === "map" ? "bg-white text-primary shadow-sm" : "text-muted"
        }`}
      >
        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
          <line x1="8" y1="2" x2="8" y2="18" />
          <line x1="16" y1="6" x2="16" y2="22" />
        </svg>
        {t("ui.map")}
      </button>
    </div>
  );
}
