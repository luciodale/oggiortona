import { useLocale } from "../../i18n/useLocale";
import { ListIcon } from "../../icons/ListIcon";
import { MapViewIcon } from "../../icons/MapViewIcon";

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
        <ListIcon className="h-3 w-3" strokeWidth={2.5} />
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
        <MapViewIcon className="h-3 w-3" strokeWidth={2.5} />
        {t("ui.map")}
      </button>
    </div>
  );
}
