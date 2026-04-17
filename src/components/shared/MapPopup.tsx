import { MapPinIcon } from "../../icons/MapPinIcon";
import type { MapPin } from "../../utils/map";
import type { PromotionRow, StorePromotionRow } from "../../types/database";
import { DealEntry } from "../restaurants/DealEntry";
import { GeneraleEntry } from "../restaurants/GeneraleEntry";
import { NewsEntry } from "../restaurants/NewsEntry";
import { SpecialEntry } from "../restaurants/SpecialEntry";
import { SaldiEntry } from "../stores/SaldiEntry";

function StatusBadge({ isOpen, openLabel, closedLabel }: { isOpen: boolean; openLabel: string; closedLabel: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.05em] ${
        isOpen ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${isOpen ? "bg-success" : "bg-danger"}`}
      />
      {isOpen ? openLabel : closedLabel}
    </span>
  );
}

function PriceRange({ range }: { range: number }) {
  return (
    <span className="ml-1.5 text-xs">
      {[1, 2, 3].map((i) => (
        <span key={i} className={i <= range ? "text-primary" : "text-price-dim"}>
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
        {pin.isOpen != null && <StatusBadge isOpen={pin.isOpen} openLabel={pin.labels?.open ?? "Aperto"} closedLabel={pin.labels?.closed ?? "Chiuso"} />}
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
        if (p.type === "special") return <SpecialEntry key={p.id} special={p as PromotionRow} />;
        if (p.type === "saldi") return <SaldiEntry key={p.id} saldi={p as StorePromotionRow} />;
        if (p.type === "deal") return <DealEntry key={p.id} deal={p} />;
        if (p.type === "news") return <NewsEntry key={p.id} news={p} />;
        if (p.type === "generale") return <GeneraleEntry key={p.id} item={p} />;
        return null;
      })}
      <div className="mt-2.5 flex gap-2">
        <button
          type="button"
          data-pin-id={pin.id}
          data-pin-variant={pin.variant ?? "default"}
          className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold tracking-[0.02em] text-primary"
        >
          {pin.labels?.details ?? "Dettagli"}
        </button>
        {pin.directionsUrl && (
          <a
            href={pin.directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="map-popup-directions flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-xs font-semibold tracking-[0.02em] no-underline"
          >
            <MapPinIcon className="h-[13px] w-[13px]" strokeWidth={2.5} />
            {pin.labels?.directions ?? "Indicazioni"}
          </a>
        )}
      </div>
    </div>
  );
}
