import { Input } from "../../ui/Input";
import { Textarea } from "../../ui/Textarea";
import { TimePicker } from "../../ui/TimePicker";
import { DurationSelect } from "../../ui/DurationSelect";

type BasePromotionFields = {
  description: string;
  price: string;
  durationDays: string;
  hasTime: boolean;
  timeStart: string;
  timeEnd: string;
};

type PromotionFormProps<T extends BasePromotionFields> = {
  form: T;
  onChange: (f: T) => void;
  showTitle: boolean;
  titlePlaceholder?: string;
  descriptionPlaceholder?: string;
  descriptionLabel?: string;
};

export function PromotionForm<T extends BasePromotionFields>({
  form,
  onChange,
  showTitle,
  titlePlaceholder = "Es. Nuovo menu estivo",
  descriptionPlaceholder = "Dettagli",
  descriptionLabel = "Descrizione",
}: PromotionFormProps<T>) {
  return (
    <div className="space-y-3">
      {showTitle && "title" in form && (
        <Input
          label="Titolo"
          required
          value={form.title as string}
          onChange={(e) => onChange({ ...form, title: e.target.value })}
          placeholder={titlePlaceholder}
        />
      )}
      <Textarea
        label={descriptionLabel}
        required={!showTitle}
        value={form.description}
        onChange={(e) => onChange({ ...form, description: e.target.value })}
        rows={2}
        placeholder={descriptionPlaceholder}
      />
      <Input
        label="Prezzo"
        type="number"
        step="0.50"
        min="0"
        value={form.price}
        onChange={(e) => onChange({ ...form, price: e.target.value })}
        placeholder="€"
      />
      <DurationSelect
        value={form.durationDays}
        onChange={(v) => onChange({ ...form, durationDays: v })}
      />
      <div>
        <label className="flex items-center gap-2 text-[13px] text-muted">
          <input
            type="checkbox"
            checked={form.hasTime}
            onChange={(e) => onChange({ ...form, hasTime: e.target.checked })}
            className="accent-accent"
          />
          Imposta orario
        </label>
        {form.hasTime && (
          <div className="mt-2 flex items-center gap-2">
            <TimePicker value={form.timeStart} onChange={(v) => onChange({ ...form, timeStart: v })} />
            <span className="text-xs text-muted">&ndash;</span>
            <TimePicker value={form.timeEnd} onChange={(v) => onChange({ ...form, timeEnd: v })} />
          </div>
        )}
      </div>
    </div>
  );
}
