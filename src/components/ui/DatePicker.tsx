import { useState } from "react";
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
import { CalendarGrid, parseISO, MONTH_NAMES } from "./CalendarGrid";
import { FormError } from "./FormError";

type DatePickerProps = {
  label?: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
};

function formatDisplay(value: string) {
  if (!value) return "";
  const [y, m, d] = parseISO(value);
  return `${d} ${MONTH_NAMES[m]} ${y}`;
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
