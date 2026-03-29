import { useState, useCallback } from "react";
import {
  useFloating,
  useClick,
  useDismiss,
  useInteractions,
  offset,
  flip,
  shift,
  FloatingPortal,
  FloatingFocusManager,
} from "@floating-ui/react";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { CalendarIcon } from "../../icons/CalendarIcon";
import { FormError } from "./FormError";

type DatePickerProps = {
  label?: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
};

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

function parseISO(value: string): [number, number, number] {
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

function formatDisplay(value: string) {
  if (!value) return "";
  const [y, m, d] = parseISO(value);
  return `${d} ${MONTH_NAMES[m]} ${y}`;
}

function CalendarGrid({
  value,
  onChange,
  onClose,
}: {
  value: string;
  onChange: (v: string) => void;
  onClose: () => void;
}) {
  const initial = value ? parseISO(value) : (() => {
    const now = new Date();
    return [now.getFullYear(), now.getMonth(), now.getDate()] as [number, number, number];
  })();

  const [viewYear, setViewYear] = useState(initial[0]);
  const [viewMonth, setViewMonth] = useState(initial[1]);

  const cells = getMonthDays(viewYear, viewMonth);
  const todayISO = formatISO(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

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
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m15 18-6-6 6-6" />
          </svg>
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
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m9 18 6-6-6-6" />
          </svg>
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

function DesktopDatePicker({ value, onChange, placeholder, label }: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  label?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "bottom-start",
    middleware: [offset(4), flip(), shift({ padding: 8 })],
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);

  return (
    <>
      <button
        ref={refs.setReference}
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={label ? `${label}: ${value ? formatDisplay(value) : (placeholder ?? "Seleziona data")}` : undefined}
        {...getReferenceProps()}
        className="flex w-full items-center gap-2 rounded-xl border border-border bg-white px-3 py-2.5 text-left text-[13px] outline-none transition-colors hover:border-accent focus:border-accent"
      >
        <CalendarIcon className="h-3.5 w-3.5 text-muted" />
        <span className={value ? "text-primary" : "text-muted/40"}>
          {value ? formatDisplay(value) : (placeholder ?? "Seleziona data")}
        </span>
      </button>
      {isOpen && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false} initialFocus={-1}>
            <div
              ref={refs.setFloating}
              role="dialog"
              aria-label="Seleziona data"
              style={floatingStyles}
              {...getFloatingProps()}
              className="z-50 rounded-xl border border-border bg-white shadow-lg"
            >
              <CalendarGrid value={value} onChange={onChange} onClose={() => setIsOpen(false)} />
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </>
  );
}

function MobileDatePicker({ value, onChange, placeholder, label }: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  label?: string;
}) {
  return (
    <div className="relative">
      <div className="pointer-events-none flex w-full items-center gap-2 rounded-xl border border-border bg-white px-3 py-2.5 text-left text-[13px]" aria-hidden="true">
        <CalendarIcon className="h-3.5 w-3.5 text-muted" />
        <span className={value ? "text-primary" : "text-muted/40"}>
          {value ? formatDisplay(value) : (placeholder ?? "Seleziona data")}
        </span>
      </div>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label ?? "Seleziona data"}
        className="absolute inset-0 cursor-pointer opacity-0"
      />
    </div>
  );
}

export function DatePicker({ label, required, value, onChange, error, placeholder }: DatePickerProps) {
  const isDesktop = useMediaQuery("(hover: hover) and (pointer: fine)");
  return (
    <div>
      {label && (
        <label className="mb-1.5 block text-[13px] font-medium text-primary">
          {label}
          {required && <span className="ml-0.5 text-danger" aria-hidden="true">*</span>}
        </label>
      )}
      {isDesktop
        ? <DesktopDatePicker value={value} onChange={onChange} placeholder={placeholder} label={label} />
        : <MobileDatePicker value={value} onChange={onChange} placeholder={placeholder} label={label} />
      }
      {error && <FormError message={error} />}
    </div>
  );
}
