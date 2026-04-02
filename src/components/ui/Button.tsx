type ButtonVariant = "primary" | "outline" | "ghost" | "danger";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-white hover:bg-accent-hover active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed",
  outline:
    "border border-border bg-card text-primary hover:bg-surface-alt active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed",
  ghost:
    "bg-transparent text-muted hover:text-primary",
  danger:
    "bg-danger/10 text-danger hover:bg-danger/20",
};

type ButtonProps = {
  variant?: ButtonVariant;
  fullWidth?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  variant = "primary",
  fullWidth = false,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`flex items-center justify-center rounded-xl py-3 text-[13px] font-semibold transition-all ${
        fullWidth ? "w-full" : ""
      } ${variantStyles[variant]} ${className}`}
      {...props}
    />
  );
}
