type AdminSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export function AdminSearch({ value, onChange }: AdminSearchProps) {
  return (
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Cerca per nome..."
      aria-label="Cerca per nome"
      className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-[13px] text-primary outline-none placeholder:text-muted/40 focus:border-accent"
    />
  );
}
