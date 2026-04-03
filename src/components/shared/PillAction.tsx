type PillActionVariant = "default" | "accent" | "promo";

const variantClasses: Record<PillActionVariant, string> = {
  default: "bg-secondary text-primary hover:bg-surface-warm",
  accent: "bg-accent/10 text-accent hover:bg-accent/20",
  promo: "bg-promo-deal-bg text-promo-deal hover:bg-promo-deal-bg/80",
};

const baseClasses =
  "inline-flex items-center rounded-full px-3 py-1 text-[12px] font-semibold no-underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

type PillActionButtonProps = {
  onClick: () => void;
  label: string;
  variant?: PillActionVariant;
};

export function PillActionButton({ onClick, label, variant = "default" }: PillActionButtonProps) {
  return (
    <button type="button" onClick={onClick} className={`${baseClasses} ${variantClasses[variant]}`}>
      {label}
    </button>
  );
}
