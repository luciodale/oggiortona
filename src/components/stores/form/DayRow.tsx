import { useWatch } from "react-hook-form";
import type { ItalianDay } from "../../../types/database";
import type { DayFormValues } from "../../../schemas/restaurant";
import type { StoreFormValues } from "../../../schemas/store";
import type { UseFormReturn } from "react-hook-form";
import { useLocale } from "../../../i18n/useLocale";
import { getDayLabel, getOrderedDays } from "../../../utils/time";
import { TimePicker } from "../../ui/TimePicker";
import { CopyFromMenu } from "../../ui/CopyFromMenu";

type DayRowProps = {
  day: ItalianDay;
  form: UseFormReturn<StoreFormValues>;
  onCopyFrom: (source: ItalianDay) => void;
};

export function DayRow({ day, form, onCopyFrom }: DayRowProps) {
  const { locale, t } = useLocale();
  const state = useWatch({ control: form.control, name: `hours.${day}` }) as DayFormValues;
  const allHours = useWatch({ control: form.control, name: "hours" }) as Record<ItalianDay, DayFormValues>;

  const closedByDay = getOrderedDays().reduce<Record<ItalianDay, boolean>>((acc, d) => {
    acc[d] = allHours[d]?.closed ?? true;
    return acc;
  }, {} as Record<ItalianDay, boolean>);

  function patch(updates: Partial<DayFormValues>) {
    const current = form.getValues(`hours.${day}`);
    form.setValue(`hours.${day}`, { ...current, ...updates }, { shouldDirty: true });
  }

  return (
    <div className="flex flex-col gap-2.5 border-b border-border-light py-4 last:border-0">
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex flex-1 items-center justify-between gap-2">
          <span className="text-[13px] font-medium text-primary">
            {getDayLabel(day, locale)}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
              state.closed
                ? "bg-danger/10 text-danger"
                : "bg-success/10 text-success"
            }`}
            aria-label={t("aria.dayState", { day: getDayLabel(day, locale) ?? "", state: state.closed ? t("common.closedLower") : t("common.openLower") })}
          >
            {state.closed ? t("common.closed") : t("common.open")}
          </span>
        </div>
        <CopyFromMenu currentDay={day} closedByDay={closedByDay} onSelect={onCopyFrom} />
      </div>

      {state.closed ? (
        <button
          type="button"
          onClick={() => patch({ closed: false })}
          className="self-start text-[11px] font-semibold text-accent underline"
        >
          {t("dayRow.openDay")}
        </button>
      ) : (
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

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
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
            <button
              type="button"
              onClick={() => patch({ closed: true })}
              className="text-[11px] text-danger underline"
            >
              {t("dayRow.closeDay")}
            </button>
          </div>

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
