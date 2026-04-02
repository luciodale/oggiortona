import { RefreshIcon } from "../../../icons/RefreshIcon";
import { TrashIcon } from "../../../icons/TrashIcon";

type PromotionCardProps = {
  expired: boolean;
  badge: React.ReactNode;
  onRenew: () => void;
  onDelete: () => void;
  children: React.ReactNode;
};

export function PromotionCard({ expired, badge, onRenew, onDelete, children }: PromotionCardProps) {
  return (
    <div className={`rounded-2xl p-4 shadow-card ${expired ? "border border-dashed border-border bg-surface-alt" : "bg-card"}`}>
      <div className="mb-2 flex flex-wrap items-center gap-1.5">
        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
          expired ? "bg-danger/10 text-danger" : "bg-success/10 text-success"
        }`}>
          {expired ? "Scaduto" : "Attivo"}
        </span>
        {badge}
      </div>
      {children}
      <div className="mt-3 flex gap-2">
        {expired && (
          <button
            type="button"
            onClick={onRenew}
            className="flex items-center gap-1.5 rounded-lg bg-success/10 px-3 py-1.5 text-[11px] font-semibold text-success transition-colors hover:bg-success/20"
          >
            <RefreshIcon className="h-3 w-3" />
            Rinnova
          </button>
        )}
        <button
          type="button"
          onClick={onDelete}
          className="flex items-center gap-1.5 rounded-lg bg-danger/10 px-3 py-1.5 text-[11px] font-semibold text-danger transition-colors hover:bg-danger/20"
        >
          <TrashIcon className="h-3 w-3" />
          Elimina
        </button>
      </div>
    </div>
  );
}
