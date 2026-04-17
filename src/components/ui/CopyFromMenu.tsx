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
} from "@floating-ui/react";
import type { ItalianDay } from "../../types/database";
import { useLocale } from "../../i18n/useLocale";
import { getDayShortLabel, getOrderedDays } from "../../utils/time";

type CopyFromMenuProps = {
  currentDay: ItalianDay;
  closedByDay: Record<ItalianDay, boolean>;
  onSelect: (source: ItalianDay) => void;
};

export function CopyFromMenu({ currentDay, closedByDay, onSelect }: CopyFromMenuProps) {
  const { locale, t } = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "bottom-end",
    middleware: [offset(4), flip(), shift({ padding: 8 })],
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);

  const otherDays = getOrderedDays().filter((d) => d !== currentDay);
  const hasAnyOpen = otherDays.some((d) => !closedByDay[d]);

  if (!hasAnyOpen) return null;

  function handleSelect(day: ItalianDay) {
    onSelect(day);
    setIsOpen(false);
  }

  return (
    <>
      <button
        ref={refs.setReference}
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        {...getReferenceProps()}
        className="rounded-full bg-surface-warm px-2.5 py-1 text-[10px] font-semibold text-muted transition-colors hover:bg-primary/10 hover:text-primary"
      >
        {t("dayRow.copyFromLabel")}
      </button>
      {isOpen && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            role="menu"
            className="z-50 flex gap-1 rounded-xl border border-border bg-card p-1.5 shadow-lg"
          >
            {otherDays.map((day) => {
              const disabled = closedByDay[day];
              return (
                <button
                  key={day}
                  type="button"
                  role="menuitem"
                  disabled={disabled}
                  onClick={() => handleSelect(day)}
                  className="rounded-md px-2 py-1 text-[11px] font-semibold text-muted transition-colors enabled:hover:bg-primary/10 enabled:hover:text-primary disabled:opacity-40"
                >
                  {getDayShortLabel(day, locale)}
                </button>
              );
            })}
          </div>
        </FloatingPortal>
      )}
    </>
  );
}
