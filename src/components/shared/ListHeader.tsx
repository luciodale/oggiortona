import { RefreshIcon } from "../../icons/RefreshIcon";
import { useLocale } from "../../i18n/useLocale";
import { ViewToggle } from "./ViewToggle";

type ViewMode = "list" | "map";

type Section = "mangiare" | "fare";

type SectionTheme = {
  hoverBorder: string;
  hoverText: string;
};

const sectionThemes: Record<Section, SectionTheme> = {
  mangiare: { hoverBorder: "hover:border-mangiare-muted", hoverText: "hover:text-mangiare" },
  fare: { hoverBorder: "hover:border-fare-muted", hoverText: "hover:text-fare" },
};

type ListHeaderProps = {
  title: string;
  section: Section;
  mode: ViewMode;
  onToggle: (m: ViewMode) => void;
  isRefreshing: boolean;
  onRefresh: () => void;
  children: React.ReactNode;
};

export function ListHeader({ title, section, mode, onToggle, isRefreshing, onRefresh, children }: ListHeaderProps) {
  const { t } = useLocale();
  const theme = sectionThemes[section];

  return (
    <div className={`space-y-3 pb-6${mode === "map" ? " relative z-30" : ""}`}>
      <div className="animate-fade-up flex items-center gap-3">
        <h1 className="font-family-display text-3xl font-medium tracking-tight text-primary">
          {title}
        </h1>
        <ViewToggle mode={mode} onToggle={onToggle} />
        <button
          type="button"
          aria-label={t("common.refresh")}
          onClick={onRefresh}
          className={`ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border-light bg-surface text-muted transition-all duration-300 ${theme.hoverBorder} ${theme.hoverText} active:scale-90`}
        >
          <RefreshIcon className={`h-[18px] w-[18px]${isRefreshing ? " animate-spin" : ""}`} />
        </button>
      </div>
      {children}
    </div>
  );
}
