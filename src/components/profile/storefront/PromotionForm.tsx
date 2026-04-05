import { useLocale } from "../../../i18n/useLocale";
import type { PromotionFormState, PromotionType } from "../../../hooks/usePromotionForms";
import type { TranslationKey } from "../../../i18n/t";
import { Input } from "../../ui/Input";
import { TimePicker } from "../../ui/TimePicker";
import { DurationSelect } from "../../ui/DurationSelect";

const TYPE_OPTIONS: Array<{ value: PromotionType; labelKey: TranslationKey }> = [
  { value: "generale", labelKey: "storefront.generale" },
  { value: "special", labelKey: "storefront.piatto" },
  { value: "deal", labelKey: "storefront.deal" },
  { value: "news", labelKey: "storefront.news" },
];

const TYPE_PILL_STYLES: Record<PromotionType, { active: string; inactive: string }> = {
  generale: { active: "bg-promo-generale-bg text-promo-generale", inactive: "text-muted" },
  special: { active: "bg-mangiare-light text-mangiare", inactive: "text-muted" },
  deal: { active: "bg-promo-deal-bg text-promo-deal", inactive: "text-muted" },
  news: { active: "bg-promo-news-bg text-promo-news", inactive: "text-muted" },
};

const PLACEHOLDER_KEYS: Record<PromotionType, TranslationKey> = {
  generale: "storefront.titlePlaceholder",
  special: "storefront.piattoPlaceholder",
  deal: "storefront.dealPlaceholder",
  news: "storefront.newsPlaceholder",
};

type PromotionFormProps = {
  form: PromotionFormState;
  onChange: (f: PromotionFormState) => void;
  onTypeChange: (type: PromotionType) => void;
};

export function PromotionForm({ form, onChange, onTypeChange }: PromotionFormProps) {
  const { t } = useLocale();

  return (
    <div className="space-y-3">
      <fieldset>
        <legend className="mb-1.5 block text-[13px] font-medium text-primary">Tipo</legend>
        <div className="flex rounded-xl bg-surface-warm p-0.5" role="group">
          {TYPE_OPTIONS.map(({ value, labelKey }) => {
            const isActive = form.type === value;
            const style = TYPE_PILL_STYLES[value];
            return (
              <button
                key={value}
                type="button"
                aria-pressed={isActive}
                onClick={() => onTypeChange(value)}
                className={`flex flex-1 items-center justify-center rounded-lg py-2 text-[11px] font-semibold uppercase tracking-[0.06em] transition-all ${
                  isActive ? `${style.active} shadow-sm` : style.inactive
                }`}
              >
                {t(labelKey)}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div>
        <Input
          label="Titolo"
          required
          maxLength={150}
          value={form.title}
          onChange={(e) => onChange({ ...form, title: e.target.value })}
          placeholder={t(PLACEHOLDER_KEYS[form.type])}
        />
        <p className="mt-1 text-right text-[10px] text-muted">{form.title.length}/150</p>
      </div>

      <Input
        label={t("storefront.priceLabel")}
        type="number"
        step="0.50"
        min="0"
        value={form.price}
        onChange={(e) => onChange({ ...form, price: e.target.value })}
        placeholder={t("storefront.pricePlaceholder")}
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
          {t("storefront.setTime")}
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
