import { Link } from "@tanstack/react-router";

type PillActionVariant = "default" | "accent" | "promo";

const variantClasses: Record<PillActionVariant, string> = {
  default: "bg-secondary text-primary hover:bg-surface-warm",
  accent: "bg-accent/10 text-accent hover:bg-accent/20",
  promo: "bg-promo-deal-bg text-promo-deal hover:bg-promo-deal-bg/80",
};

const baseClasses =
  "inline-flex items-center rounded-full px-3 py-1 text-[12px] font-semibold no-underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

type PillActionLinkProps = {
  to: string;
  params?: Record<string, string>;
  label: string;
  variant?: PillActionVariant;
};

type PillActionButtonProps = {
  onClick: () => void;
  label: string;
  variant?: PillActionVariant;
};

export function PillActionLink({ to, params, label, variant = "default" }: PillActionLinkProps) {
  return (
    <Link to={to} params={params} className={`${baseClasses} ${variantClasses[variant]}`}>
      {label}
    </Link>
  );
}

export function PillActionButton({ onClick, label, variant = "default" }: PillActionButtonProps) {
  return (
    <button type="button" onClick={onClick} className={`${baseClasses} ${variantClasses[variant]}`}>
      {label}
    </button>
  );
}
