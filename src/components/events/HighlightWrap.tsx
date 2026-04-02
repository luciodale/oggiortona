import type { ReactNode } from "react";

type HighlightWrapProps = {
  id: number;
  label: string;
  children: ReactNode;
  className?: string;
};

export function HighlightWrap({ label, children, className }: HighlightWrapProps) {
  return (
    <div className={`relative mt-4 first:mt-0 ${className ?? ""}`}>
      <span className="absolute -top-3 right-3 z-10 bg-fare px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide text-white">
        {label}
      </span>
      <div className="rounded-2xl border-2 border-fare p-1.5">
        {children}
      </div>
    </div>
  );
}
