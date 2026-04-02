type PillProps = {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

export function Pill({ active, onClick, children }: PillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`shrink-0 rounded-full px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.04em] transition-all ${
        active
          ? "bg-muted text-card shadow-sm"
          : "bg-surface-warm text-muted hover:text-primary"
      }`}
    >
      {children}
    </button>
  );
}
