import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MapPopup } from "../components/shared/MapPopup";
import type { PromotionRow } from "../types/database";

export type PinVariant = "restaurant" | "event" | "default";

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
  promotions?: Array<PromotionRow>;
};

export const ORTONA_CENTER: [number, number] = [42.3548, 14.4030];
export const DEFAULT_ZOOM = 15;
export const TILE_URL = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

export function buildPopupHtml(pin: MapPin) {
  return renderToStaticMarkup(createElement(MapPopup, { pin }));
}

export const MAP_CSS = `
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
  .leaflet-control-zoom {
    border: none !important;
    border-radius: 14px !important;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06) !important;
  }
  .leaflet-control-zoom a {
    width: 38px !important;
    height: 38px !important;
    line-height: 38px !important;
    font-size: 18px !important;
    font-weight: 500 !important;
    background: rgba(253,250,246,0.85) !important;
    -webkit-backdrop-filter: blur(12px);
    backdrop-filter: blur(12px);
    color: #2c1810 !important;
    border: none !important;
    border-bottom: 1px solid #e0d5c5 !important;
    font-family: var(--font-family) !important;
    transition: background 0.15s ease;
  }
  .leaflet-control-zoom a:last-child {
    border-bottom: none !important;
  }
  .leaflet-control-zoom a:hover {
    background: rgba(240,232,219,0.9) !important;
  }
  .leaflet-control-zoom a:active {
    background: rgba(224,213,197,0.95) !important;
  }
  .leaflet-control-attribution {
    display: none !important;
  }
`;
