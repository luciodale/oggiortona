import { TrashIcon } from "../../../icons/TrashIcon";
import { RefreshIcon } from "../../../icons/RefreshIcon";

type PromotionCardProps = {
  expired: boolean;
  onRenew: () => void;
  onDelete: () => void;
  children: React.ReactNode;
};

export function PromotionCard({ expired, onRenew, onDelete, children }: PromotionCardProps) {
  return (
    <div className={`rounded-2xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] ${expired ? "border border-dashed border-border bg-surface-alt" : "bg-white"}`}>
      <span className={`mb-2 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
        expired ? "bg-danger/10 text-danger" : "bg-success/10 text-success"
      }`}>
        {expired ? "Scaduto" : "Attivo"}
      </span>
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
