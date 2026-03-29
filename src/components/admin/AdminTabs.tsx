import type { AdminTab } from "./AdminDashboard";

type AdminTabsProps = {
  tab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
};

export function AdminTabs({ tab, onTabChange }: AdminTabsProps) {
  return (
    <div className="flex rounded-xl bg-surface-warm p-0.5" role="tablist" aria-label="Sezione">
      <button
        type="button"
        role="tab"
        aria-selected={tab === "restaurants"}
        onClick={() => onTabChange("restaurants")}
        className={`flex flex-1 items-center justify-center rounded-lg py-2 text-[11px] font-semibold uppercase tracking-[0.06em] transition-all ${
          tab === "restaurants" ? "bg-white text-primary shadow-sm" : "text-muted"
        }`}
      >
        Ristoranti
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={tab === "events"}
        onClick={() => onTabChange("events")}
        className={`flex flex-1 items-center justify-center rounded-lg py-2 text-[11px] font-semibold uppercase tracking-[0.06em] transition-all ${
          tab === "events" ? "bg-white text-primary shadow-sm" : "text-muted"
        }`}
      >
        Eventi
      </button>
    </div>
  );
}
