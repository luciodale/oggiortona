import { useRef } from "react";
import { useLeafletMap } from "../../hooks/useLeafletMap";
import type { OnPinClick } from "../../hooks/useLeafletMap";
import { ORTONA_CENTER, DEFAULT_ZOOM, MAP_CSS } from "../../utils/map";
export type { MapPin } from "../../utils/map";

type MapViewProps = {
  pins: Array<import("../../utils/map").MapPin>;
  center?: [number, number];
  zoom?: number;
  onPinClick?: OnPinClick;
};

export function MapView({ pins, center = ORTONA_CENTER, zoom = DEFAULT_ZOOM, onPinClick }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  useLeafletMap(containerRef, pins, center, zoom, onPinClick);

  return (
    <>
      <style>{MAP_CSS}</style>
      <div ref={containerRef} role="application" aria-label="Mappa interattiva" className="h-full min-h-[300px] w-full" />
    </>
  );
}
