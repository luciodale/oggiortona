import { useState, useRef, useEffect, useCallback } from "react";
import {
  useFloating,
  useClick,
  useDismiss,
  useInteractions,
  offset,
  flip,
  shift,
  FloatingPortal,
} from "@floating-ui/react";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { ClockIcon } from "../../icons/ClockIcon";
import { normalizeTimeValue } from "../../utils/time";

type TimePickerProps = {
  value: string;
  onChange: (value: string) => void;
};

function parseTime(value: string): [number, number] {
  const [h, m] = value.split(":").map(Number);
  return [h ?? 0, m ?? 0];
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5);

function ScrollColumn({
  items,
  selected,
  onSelect,
  label,
}: {
  items: Array<number>;
  selected: number;
  onSelect: (v: number) => void;
  label: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (selectedRef.current && containerRef.current) {
      const container = containerRef.current;
      const el = selectedRef.current;
      container.scrollTop = el.offsetTop - container.clientHeight / 2 + el.clientHeight / 2;
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex h-48 flex-col overflow-y-auto scroll-smooth"
      role="listbox"
      aria-label={label}
    >
      {items.map((item) => {
        const isSelected = item === selected;
        return (
          <button
            key={item}
            ref={isSelected ? selectedRef : undefined}
            type="button"
            role="option"
            aria-selected={isSelected}
            onClick={() => onSelect(item)}
            className={`shrink-0 px-4 py-1.5 text-center text-[13px] font-medium transition-colors ${
              isSelected
                ? "bg-muted text-card"
                : "text-muted hover:bg-surface-warm hover:text-primary"
            }`}
          >
            {pad(item)}
          </button>
        );
      })}
    </div>
  );
}

function DesktopTimePicker({ value, onChange }: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hours, minutes] = parseTime(value);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "bottom-start",
    middleware: [offset(4), flip(), shift({ padding: 8 })],
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
  ]);

  const handleHourSelect = useCallback(
    (h: number) => {
      onChange(`${pad(h)}:${pad(minutes)}`);
    },
    [minutes, onChange],
  );

  const handleMinuteSelect = useCallback(
    (m: number) => {
      onChange(`${pad(hours)}:${pad(m)}`);
      setIsOpen(false);
    },
    [hours, onChange],
  );

  return (
    <>
      <button
        ref={refs.setReference}
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`Seleziona orario: ${value}`}
        {...getReferenceProps()}
        className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-[13px] font-medium text-primary outline-none transition-colors hover:border-accent focus:border-accent"
      >
        <ClockIcon className="h-3.5 w-3.5 text-muted" />
        {value}
      </button>
      {isOpen && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className="z-50 flex overflow-hidden rounded-xl border border-border bg-card shadow-lg"
          >
            <ScrollColumn
              items={HOURS}
              selected={hours}
              onSelect={handleHourSelect}
              label="Ore"
            />
            <div className="w-px bg-border" />
            <ScrollColumn
              items={MINUTES}
              selected={minutes}
              onSelect={handleMinuteSelect}
              label="Minuti"
            />
          </div>
        </FloatingPortal>
      )}
    </>
  );
}

function MobileTimePicker({ value, onChange }: TimePickerProps) {
  return (
    <input
      type="time"
      value={value}
      onChange={(e) => onChange(normalizeTimeValue(e.target.value))}
      onBlur={(e) => {
        const normalized = normalizeTimeValue(e.target.value);
        if (normalized !== value) {
          onChange(normalized);
        }
      }}
      aria-label="Seleziona orario"
      className="h-[42px] flex-1 appearance-none rounded-xl border border-border bg-card px-3 text-[13px] outline-none focus:border-accent"
    />
  );
}

export function TimePicker(props: TimePickerProps) {
  const isDesktop = useMediaQuery("(hover: hover) and (pointer: fine)");

  if (isDesktop) {
    return <DesktopTimePicker {...props} />;
  }

  return <MobileTimePicker {...props} />;
}
