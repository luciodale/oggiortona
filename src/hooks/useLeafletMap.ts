import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { buildPopupHtml, getCardColor, getTileUrl } from "../utils/map";
import type { MapPin, PinVariant } from "../utils/map";

function createPinIcon(color: string, variant: PinVariant, stroke: string) {
  if (variant === "restaurant") {
    return L.divIcon({
      html: `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r="16" fill="${color}" stroke="${stroke}" stroke-width="2.5"/>
        <g transform="translate(18,18)" stroke="${stroke}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none">
          <line x1="-4" y1="-7" x2="-4" y2="7"/>
          <line x1="-6.5" y1="-7" x2="-6.5" y2="-3"/>
          <line x1="-1.5" y1="-7" x2="-1.5" y2="-3"/>
          <path d="M-6.5,-3 Q-6.5,0 -4,0 Q-1.5,0 -1.5,-3"/>
          <line x1="4" y1="-7" x2="4" y2="7"/>
          <path d="M4,-7 Q7,-5 7,-2 Q7,0 4,0"/>
        </g>
      </svg>`,
      className: "custom-pin",
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -20],
    });
  }

  return L.divIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
      <circle cx="15" cy="15" r="13" fill="${color}" stroke="${stroke}" stroke-width="2.5"/>
      <circle cx="15" cy="15" r="4" fill="${stroke}" opacity="0.9"/>
    </svg>`,
    className: "custom-pin",
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -18],
  });
}

export function useLeafletMap(
  containerRef: React.RefObject<HTMLDivElement | null>,
  pins: Array<MapPin>,
  center: [number, number],
  zoom: number,
) {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const map = L.map(containerRef.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView(center, zoom);

    L.tileLayer(getTileUrl(), { maxZoom: 18 }).addTo(map);
    L.control.zoom({ position: "topright" }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [center, zoom]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const markers: Array<L.Marker> = [];

    const stroke = getCardColor();
    for (const pin of pins) {
      const icon = createPinIcon(pin.color ?? "#c4512a", pin.variant ?? "default", stroke);
      const marker = L.marker([pin.lat, pin.lng], { icon })
        .addTo(map)
        .bindPopup(buildPopupHtml(pin), {
          closeButton: false,
          className: "retro-popup",
          maxWidth: 260,
        });
      markers.push(marker);
    }

    return () => {
      for (const m of markers) {
        m.remove();
      }
    };
  }, [pins]);
}
