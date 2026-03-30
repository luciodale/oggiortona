import { useState, useCallback } from "react";
import { ChevronLeftIcon } from "../../icons/ChevronLeftIcon";
import { ChevronRightIcon } from "../../icons/ChevronRightIcon";
import { getTodayISO } from "../../utils/date";

const WEEKDAYS = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];
const MONTH_NAMES = [
  "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
  "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre",
];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function formatISO(year: number, month: number, day: number) {
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

export function parseISO(value: string): [number, number, number] {
  const [y, m, d] = value.split("-").map(Number);
  return [y ?? 2026, (m ?? 1) - 1, d ?? 1];
}

function getMonthDays(year: number, month: number): Array<number | null> {
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDow = firstDay.getDay();
  const mondayOffset = startDow === 0 ? 6 : startDow - 1;

  const cells: Array<number | null> = [];
  for (let i = 0; i < mondayOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

export { MONTH_NAMES };

type CalendarGridProps = {
  value: string;
  onChange: (v: string) => void;
  onClose: () => void;
};

export function CalendarGrid({ value, onChange, onClose }: CalendarGridProps) {
  const initial = parseISO(value || getTodayISO());

  const [viewYear, setViewYear] = useState(initial[0]);
  const [viewMonth, setViewMonth] = useState(initial[1]);

  const cells = getMonthDays(viewYear, viewMonth);
  const todayISO = getTodayISO();

  const goPrev = useCallback(() => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  }, [viewMonth]);

  const goNext = useCallback(() => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  }, [viewMonth]);

  function handleDayClick(day: number) {
    const iso = formatISO(viewYear, viewMonth, day);
    onChange(iso);
    onClose();
  }

  return (
    <div className="w-[280px] p-3">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={goPrev}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-warm hover:text-primary"
          aria-label="Mese precedente"
        >
          <ChevronLeftIcon className="h-3.5 w-3.5" />
        </button>
        <span className="text-[13px] font-semibold text-primary">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <button
          type="button"
          onClick={goNext}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-warm hover:text-primary"
          aria-label="Mese successivo"
        >
          <ChevronRightIcon className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {WEEKDAYS.map((wd) => (
          <div key={wd} className="py-1 text-center text-[10px] font-medium text-muted/60">
            {wd}
          </div>
        ))}

        {cells.map((day, i) => {
          if (day == null) return <div key={`pad-${i}`} />;

          const iso = formatISO(viewYear, viewMonth, day);
          const isSelected = iso === value;
          const isToday = iso === todayISO;

          return (
            <button
              key={iso}
              type="button"
              onClick={() => handleDayClick(day)}
              className={`flex h-9 items-center justify-center rounded-lg text-[12px] font-medium transition-colors ${
                isSelected
                  ? "bg-fare text-white"
                  : isToday
                    ? "bg-fare/10 text-fare hover:bg-fare/20"
                    : "text-primary hover:bg-surface-warm"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
