type ButtonVariant = "primary" | "ghost" | "danger";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-mangiare text-white hover:bg-mangiare/90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed",
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
      className={`rounded-xl py-3 text-[13px] font-semibold transition-all ${
        fullWidth ? "w-full" : ""
      } ${variantStyles[variant]} ${className}`}
      {...props}
    />
  );
}
