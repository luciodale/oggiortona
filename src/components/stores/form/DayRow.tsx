import { useWatch } from "react-hook-form";
import type { ItalianDay } from "../../../types/database";
import type { DayFormValues } from "../../../schemas/restaurant";
import type { StoreFormValues } from "../../../schemas/store";
import type { UseFormReturn } from "react-hook-form";
import { useLocale } from "../../../i18n/useLocale";
import { getDayLabel, getOrderedDays } from "../../../utils/time";
import { TimePicker } from "../../ui/TimePicker";

type DayRowProps = {
  day: ItalianDay;
  dayIndex: number;
  form: UseFormReturn<StoreFormValues>;
  onCopyPrevious: () => void;
};

export function DayRow({ day, dayIndex, form, onCopyPrevious }: DayRowProps) {
  const { locale, t } = useLocale();
  const state = useWatch({ control: form.control, name: `hours.${day}` }) as DayFormValues;
  const days = getOrderedDays();
  const prevDay = dayIndex > 0 ? days[dayIndex - 1] : undefined;

  function patch(updates: Partial<DayFormValues>) {
    const current = form.getValues(`hours.${day}`);
    form.setValue(`hours.${day}`, { ...current, ...updates }, { shouldDirty: true });
  }

  return (
    <div className="flex flex-col gap-2.5 border-b border-border-light py-4 last:border-0">
      <div className="flex w-full items-center justify-between gap-2">
        <button
          type="button"
          className="flex flex-1 items-center justify-between bg-transparent p-0 text-left"
          onClick={() => patch({ closed: !state.closed })}
          aria-pressed={!state.closed}
          aria-label={t("aria.dayState", { day: getDayLabel(day, locale) ?? "", state: state.closed ? t("common.closedLower") : t("common.openLower") })}
        >
          <span className="text-[13px] font-medium text-primary">
            {getDayLabel(day, locale)}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-all ${
              state.closed
                ? "bg-danger/10 text-danger"
                : "bg-success/10 text-success"
            }`}
          >
            {state.closed ? t("common.closed") : t("common.open")}
          </span>
        </button>
        {prevDay && (
          <button
            type="button"
            onClick={onCopyPrevious}
            className="rounded-full bg-surface-warm px-2.5 py-1 text-[10px] font-semibold text-muted transition-colors hover:bg-primary/10 hover:text-primary"
          >
            {t("dayRow.copyFrom", { day: (getDayLabel(prevDay, locale) ?? "").toLowerCase() })}
          </button>
        )}
      </div>

      {!state.closed && (
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <TimePicker
              value={state.open}
              onChange={(v) => patch({ open: v })}
            />
            <span className="text-xs text-muted">&ndash;</span>
            <TimePicker
              value={state.close}
              onChange={(v) => patch({ close: v })}
            />
          </div>

          <button
            type="button"
            onClick={() => patch({ hasSecondShift: !state.hasSecondShift })}
            aria-expanded={state.hasSecondShift}
            className="text-[11px] text-muted underline"
          >
            {state.hasSecondShift
              ? t("dayRow.removeSecondShift")
              : t("dayRow.addSecondShift")}
          </button>

          {state.hasSecondShift && (
            <div className="flex items-center gap-2">
              <TimePicker
                value={state.open2}
                onChange={(v) => patch({ open2: v })}
              />
              <span className="text-xs text-muted">&ndash;</span>
              <TimePicker
                value={state.close2}
                onChange={(v) => patch({ close2: v })}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
