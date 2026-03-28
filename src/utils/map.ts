type PinSpecial = {
  description: string;
  price: number | null;
};

type PinDeal = {
  title: string;
  description: string | null;
  validUntil: string;
};

type PinNews = {
  title: string;
  description: string | null;
};

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
  special?: PinSpecial | null;
  deal?: PinDeal | null;
  news?: PinNews | null;
};

export const ORTONA_CENTER: [number, number] = [42.3548, 14.4030];
export const DEFAULT_ZOOM = 15;
export const TILE_URL = "https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}.png";

export function escapeHtml(str: string) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function buildPopupHtml(pin: MapPin) {
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

  const newsHtml = pin.news
    ? `<div style="
        margin-top: 8px; padding: 8px 10px; border-radius: 10px;
        background: #eef6f1; text-align: left;
      ">
        <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#4a7c59;">Novità</div>
        <div style="font-size:12px;font-weight:500;color:#2c1810;margin-top:2px;">${escapeHtml(pin.news.title)}</div>
        ${pin.news.description ? `<div style="font-size:11px;color:#8c7e6f;margin-top:1px;">${escapeHtml(pin.news.description)}</div>` : ""}
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
    ${newsHtml}
    ${directionsHtml}
  </div>`;
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
