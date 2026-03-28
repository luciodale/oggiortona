type DurationSelectProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  max?: number;
};

export function DurationSelect({ label = "Durata", value, onChange, max = 7 }: DurationSelectProps) {
  const options = Array.from({ length: max }, (_, i) => i + 1);

  return (
    <fieldset>
      <legend className="mb-1.5 block text-[13px] font-medium text-primary">{label}</legend>
      <div className="flex gap-1.5" role="group">
        {options.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(String(n))}
            aria-pressed={String(n) === value}
            aria-label={`${n} ${n === 1 ? "giorno" : "giorni"}`}
            className={`flex-1 rounded-xl py-2 text-center text-[13px] font-semibold transition-all ${
              String(n) === value
                ? "bg-primary text-white"
                : "bg-surface-warm text-muted hover:text-primary"
            }`}
          >
            {n}g
          </button>
        ))}
      </div>
    </fieldset>
  );
}
