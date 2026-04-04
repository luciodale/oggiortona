import { MapPinIcon } from "../../icons/MapPinIcon";
import type { MapPin } from "../../utils/map";
import { DealEntry } from "../restaurants/DealEntry";
import { NewsEntry } from "../restaurants/NewsEntry";
import { SpecialEntry } from "../restaurants/SpecialEntry";

function StatusBadge({ isOpen }: { isOpen: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.05em] ${
        isOpen ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${isOpen ? "bg-success" : "bg-danger"}`}
      />
      {isOpen ? "Aperto" : "Chiuso"}
    </span>
  );
}

function PriceRange({ range }: { range: number }) {
  return (
    <span className="ml-1.5 text-xs">
      {[1, 2, 3].map((i) => (
        <span key={i} className={i <= range ? "text-primary" : "text-border"}>
          &euro;
        </span>
      ))}
    </span>
  );
}

export function MapPopup({ pin }: { pin: MapPin }) {
  return (
    <div className="min-w-[180px] py-1" style={{ fontFamily: "var(--font-family)" }}>
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {pin.isOpen != null && <StatusBadge isOpen={pin.isOpen} />}
        {pin.priceRange != null && pin.priceRange > 0 && (
          <PriceRange range={pin.priceRange} />
        )}
      </div>
      <p className="mt-1.5 text-center font-family-display text-[17px] font-medium leading-tight text-primary">
        {pin.label}
      </p>
      {pin.subtitle && (
        <span className="mt-0.5 block text-xs text-center text-muted">{pin.subtitle}</span>
      )}
      {pin.promotions?.map((p) => {
        if (p.type === "special") return <SpecialEntry key={p.id} special={p} />;
        if (p.type === "deal") return <DealEntry key={p.id} deal={p} />;
        if (p.type === "news") return <NewsEntry key={p.id} news={p} />;
        return null;
      })}
      <div className="mt-2.5 flex gap-2">
        <button
          type="button"
          data-pin-id={pin.id}
          data-pin-variant={pin.variant ?? "default"}
          className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold tracking-[0.02em] text-primary"
        >
          Dettagli
        </button>
        {pin.directionsUrl && (
          <a
            href={pin.directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold tracking-[0.02em] text-card no-underline"
          >
            <MapPinIcon className="h-[13px] w-[13px]" strokeWidth={2.5} />
            Indicazioni
          </a>
        )}
      </div>
    </div>
  );
}
