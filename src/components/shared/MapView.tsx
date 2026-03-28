import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type PinVariant = "restaurant" | "event" | "default";

type PinSpecial = {
  description: string;
  price: number | null;
};

type PinDeal = {
  title: string;
  description: string | null;
  validUntil: string;
};

export type MapPin = {
  id: number;
  lat: number;
  lng: number;
  label: string;
  subtitle?: string;
  href: string;
  directionsUrl?: string;
  color?: string;
  variant?: PinVariant;
  isOpen?: boolean;
  priceRange?: number;
  special?: PinSpecial | null;
  deal?: PinDeal | null;
};

type MapViewProps = {
  pins: Array<MapPin>;
  center?: [number, number];
  zoom?: number;
};

function createPinIcon(color: string, variant: PinVariant) {
  if (variant === "restaurant") {
    return L.divIcon({
      html: `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r="16" fill="${color}" stroke="#fdfaf6" stroke-width="2.5"/>
        <g transform="translate(18,18)" stroke="#fdfaf6" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none">
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
      <circle cx="15" cy="15" r="13" fill="${color}" stroke="#fdfaf6" stroke-width="2.5"/>
      <circle cx="15" cy="15" r="4" fill="#fdfaf6" opacity="0.9"/>
    </svg>`,
    className: "custom-pin",
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -18],
  });
}

const ORTONA_CENTER: [number, number] = [42.3548, 14.4030];
const DEFAULT_ZOOM = 15;

// Stadia Outdoors: warm tones, clear roads, terrain shading
const TILE_URL = "https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}.png";

function escapeHtml(str: string) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function buildPopupHtml(pin: MapPin) {
  const statusBadge = pin.isOpen != null
    ? `<span style="
        display: inline-flex; align-items: center; gap: 4px;
        padding: 2px 8px; border-radius: 20px;
        font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;
        ${pin.isOpen
          ? "background: rgba(74,124,89,0.1); color: #4a7c59;"
          : "background: rgba(184,66,51,0.1); color: #b84233;"
        }
      ">
        <span style="width:6px;height:6px;border-radius:50%;background:${pin.isOpen ? "#4a7c59" : "#b84233"}"></span>
        ${pin.isOpen ? "Aperto" : "Chiuso"}
      </span>`
    : "";

  const priceHtml = pin.priceRange
    ? `<span style="font-size:12px;margin-left:6px;">${
        [1, 2, 3].map(i => `<span style="color:${i <= pin.priceRange! ? "#2c1810" : "#e0d5c5"}">&euro;</span>`).join("")
      }</span>`
    : "";

  const specialHtml = pin.special
    ? `<div style="
        margin-top: 8px; padding: 8px 10px; border-radius: 10px;
        background: #fdf2ed; text-align: left;
      ">
        <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#c4512a;">Piatto del giorno</div>
        <div style="font-size:12px;color:#2c1810;margin-top:2px;">
          ${escapeHtml(pin.special.description)}${pin.special.price != null ? ` <b>${pin.special.price.toFixed(2)}&euro;</b>` : ""}
        </div>
      </div>`
    : "";

  const dealHtml = pin.deal
    ? `<div style="
        margin-top: 8px; padding: 8px 10px; border-radius: 10px;
        background: #f3f0ff; text-align: left;
      ">
        <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#6d28d9;">Offerta</div>
        <div style="font-size:12px;font-weight:500;color:#2c1810;margin-top:2px;">${escapeHtml(pin.deal.title)}</div>
        ${pin.deal.description ? `<div style="font-size:11px;color:#8c7e6f;margin-top:1px;">${escapeHtml(pin.deal.description)}</div>` : ""}
      </div>`
    : "";

  const directionsHtml = pin.directionsUrl
    ? `<a href="${pin.directionsUrl}" target="_blank" rel="noopener noreferrer" style="
        display: inline-flex; align-items: center; gap: 5px;
        margin-top: 10px; padding: 8px 16px;
        font-size: 12px; font-weight: 600; font-family: var(--font-family);
        color: #fdfaf6; background: #2c1810; border-radius: 10px;
        text-decoration: none; letter-spacing: 0.02em;
      ">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
        Indicazioni
      </a>`
    : "";

  return `<div style="font-family: var(--font-family); text-align: center; padding: 4px 0; min-width: 180px;">
    <div style="display:flex;align-items:center;justify-content:center;gap:6px;flex-wrap:wrap;">
      ${statusBadge}
      ${priceHtml}
    </div>
    <a href="${pin.href}" style="
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 17px;
      font-weight: 500;
      color: #2c1810;
      text-decoration: none;
      display: block;
      margin-top: 6px;
      line-height: 1.2;
    ">${escapeHtml(pin.label)}</a>
    ${pin.subtitle ? `<span style="font-size: 12px; color: #8c7e6f; margin-top: 2px; display: block;">${escapeHtml(pin.subtitle)}</span>` : ""}
    ${specialHtml}
    ${dealHtml}
    ${directionsHtml}
  </div>`;
}

export function MapView({ pins, center = ORTONA_CENTER, zoom = DEFAULT_ZOOM }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clean up stale instance if it exists (e.g. back navigation)
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const map = L.map(containerRef.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView(center, zoom);

    L.tileLayer(TILE_URL, { maxZoom: 18 }).addTo(map);
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

    for (const pin of pins) {
      const icon = createPinIcon(pin.color ?? "#c4512a", pin.variant ?? "default");
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

  return (
    <>
      <style>{`
        .custom-pin {
          background: none !important;
          border: none !important;
          transition: transform 0.15s ease-out;
        }
        .custom-pin:hover {
          transform: scale(1.15);
          z-index: 1000 !important;
        }
        .retro-popup .leaflet-popup-content-wrapper {
          background: #fdfaf6;
          border: 1px solid #e0d5c5;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.12);
          padding: 0;
        }
        .retro-popup .leaflet-popup-content {
          margin: 16px 20px;
          line-height: 1.4;
        }
        .retro-popup .leaflet-popup-tip {
          background: #fdfaf6;
          border: 1px solid #e0d5c5;
          border-top: none;
          border-right: none;
        }
        .leaflet-control-zoom a {
          background: #fdfaf6 !important;
          color: #2c1810 !important;
          border-color: #e0d5c5 !important;
          font-family: var(--font-family) !important;
        }
        .leaflet-control-zoom a:hover {
          background: #f0e8db !important;
        }
        .leaflet-control-attribution {
          display: none !important;
        }
      `}</style>
      <div
        ref={containerRef}
        className="h-full w-full"
        style={{ minHeight: "300px" }}
      />
    </>
  );
}
