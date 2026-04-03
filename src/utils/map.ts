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
export const TILE_URL_LIGHT = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
export const TILE_URL_DARK = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

export function getTileUrl() {
  if (typeof document !== "undefined" && document.documentElement.classList.contains("dark")) {
    return TILE_URL_DARK;
  }
  return TILE_URL_LIGHT;
}

export function getCardColor() {
  if (typeof document === "undefined") return "#ffffff";
  return getComputedStyle(document.documentElement).getPropertyValue("--color-card").trim();
}

export function getThemeColor(token: string) {
  if (typeof document === "undefined") return "";
  return getComputedStyle(document.documentElement).getPropertyValue(token).trim();
}

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
    background: var(--color-card);
    border: 1px solid var(--color-border);
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.12);
    padding: 0;
  }
  .retro-popup .leaflet-popup-content {
    margin: 16px 20px;
    line-height: 1.4;
  }
  .retro-popup .leaflet-popup-tip {
    background: var(--color-card);
    border: 1px solid var(--color-border);
    border-top: none;
    border-right: none;
  }
  .map-fullscreen .leaflet-top.leaflet-right {
    top: calc(env(safe-area-inset-top, 0px) + 140px) !important;
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
    background: var(--color-surface-alt) !important;
    -webkit-backdrop-filter: blur(12px);
    backdrop-filter: blur(12px);
    color: var(--color-primary) !important;
    border: none !important;
    border-bottom: 1px solid var(--color-border) !important;
    font-family: var(--font-family) !important;
    transition: background 0.15s ease;
  }
  .leaflet-control-zoom a:last-child {
    border-bottom: none !important;
  }
  .leaflet-control-zoom a:hover {
    background: var(--color-surface-warm) !important;
  }
  .leaflet-control-zoom a:active {
    background: var(--color-border) !important;
  }
  .leaflet-control-attribution {
    display: none !important;
  }
`;
