import { useLocale } from "../../../i18n/useLocale";
import type { StorePromotionFormState, StorePromotionType } from "../../../hooks/useStorePromotionForm";
import type { TranslationKey } from "../../../i18n/t";
import { Input } from "../../ui/Input";
import { OptionalTimePicker } from "../../ui/OptionalTimePicker";

const TYPE_OPTIONS: Array<{ value: StorePromotionType; labelKey: TranslationKey }> = [
  { value: "generale", labelKey: "storefront.generale" },
  { value: "saldi", labelKey: "storefront.saldi" },
  { value: "deal", labelKey: "storefront.deal" },
  { value: "news", labelKey: "storefront.news" },
];

const TYPE_PILL_STYLES: Record<StorePromotionType, { active: string; inactive: string }> = {
  generale: { active: "bg-promo-generale-bg text-promo-generale", inactive: "text-muted" },
  saldi: { active: "bg-promo-saldi-bg text-promo-saldi", inactive: "text-muted" },
  deal: { active: "bg-promo-deal-bg text-promo-deal", inactive: "text-muted" },
  news: { active: "bg-promo-news-bg text-promo-news", inactive: "text-muted" },
};

const PLACEHOLDER_KEYS: Record<StorePromotionType, TranslationKey> = {
  generale: "storefront.titlePlaceholder",
  saldi: "storefront.saldiPlaceholder",
  deal: "storefront.dealPlaceholder",
  news: "storefront.newsPlaceholder",
};

type StorePromotionFormProps = {
  form: StorePromotionFormState;
  onChange: (f: StorePromotionFormState) => void;
  onTypeChange: (type: StorePromotionType) => void;
  titleError?: string;
  onValidateTitle?: (title: string) => void;
};

export function StorePromotionForm({ form, onChange, onTypeChange, titleError, onValidateTitle }: StorePromotionFormProps) {
  const { t } = useLocale();

  return (
    <div className="space-y-3">
      <fieldset>
        <legend className="mb-1.5 block text-[13px] font-medium text-primary">{t("common.type")}</legend>
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
          label={t("common.title")}
          required
          maxLength={150}
          value={form.title}
          onChange={(e) => onChange({ ...form, title: e.target.value })}
          onBlur={() => onValidateTitle?.(form.title)}
          error={titleError}
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

      <p className="rounded-xl bg-surface-warm px-3 py-2 text-[12px] text-muted">
        {t("storefront.durationNotice")}
      </p>

      <div className="space-y-2">
        <p className="text-[13px] font-medium text-primary">{t("events.time")}</p>
        <OptionalTimePicker
          label={t("events.timeStart")}
          value={form.timeStart}
          onChange={(v) => onChange({ ...form, timeStart: v })}
        />
        <OptionalTimePicker
          label={t("events.timeEnd")}
          value={form.timeEnd}
          onChange={(v) => onChange({ ...form, timeEnd: v })}
        />
      </div>
    </div>
  );
}
