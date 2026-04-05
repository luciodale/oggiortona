import { ClockIcon } from "../../icons/ClockIcon";
import { XIcon } from "../../icons/XIcon";
import { useLocale } from "../../i18n/useLocale";
import { TimePicker } from "./TimePicker";

type OptionalTimePickerProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export function OptionalTimePicker({ label, value, onChange }: OptionalTimePickerProps) {
  const { t } = useLocale();

  if (!value) {
    return (
      <button
        type="button"
        onClick={() => onChange("12:00")}
        className="flex w-full items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-[13px] text-muted transition-colors hover:border-accent hover:text-primary"
      >
        <ClockIcon className="h-3.5 w-3.5" strokeWidth={2} />
        {label}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <TimePicker value={value} onChange={onChange} />
      <button
        type="button"
        onClick={() => onChange("")}
        aria-label={t("ui.removeTime")}
        className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl border border-border text-muted transition-colors hover:border-danger hover:text-danger"
      >
        <XIcon className="h-3.5 w-3.5" strokeWidth={2.5} />
      </button>
    </div>
  );
}
