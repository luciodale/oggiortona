import { useCallback, useEffect, useRef } from "react";
import type L from "leaflet";
import { ORTONA_CENTER, TILE_URL } from "../utils/map";

const PICKER_PIN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="48" viewBox="0 0 36 48">
  <path d="M18 0C8.06 0 0 8.06 0 18c0 13.5 18 30 18 30s18-16.5 18-30C36 8.06 27.94 0 18 0z" fill="#c4512a" stroke="#fdfaf6" stroke-width="2"/>
  <circle cx="18" cy="18" r="6" fill="#fdfaf6"/>
</svg>`;

type LocationPickerOptions = {
  latitude: number | null;
  longitude: number | null;
  onMove: (lat: number, lng: number) => void;
};

export function useLocationPicker({
  latitude,
  longitude,
  onMove,
}: LocationPickerOptions) {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const onMoveRef = useRef(onMove);
  onMoveRef.current = onMove;
  const latRef = useRef(latitude);
  const lngRef = useRef(longitude);
  latRef.current = latitude;
  lngRef.current = longitude;

  const callbackRef = useCallback(function callbackRef(node: HTMLDivElement | null) {
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
      markerRef.current = null;
    }

    if (!node) return;

    import("leaflet").then((leaflet) => {
      const Leaflet = leaflet.default;
      import("leaflet/dist/leaflet.css");

      const center: [number, number] =
        latRef.current != null && lngRef.current != null
          ? [latRef.current, lngRef.current]
          : ORTONA_CENTER;

      const map = Leaflet.map(node, {
        zoomControl: false,
        attributionControl: false,
      }).setView(center, 17);

      Leaflet.tileLayer(TILE_URL, { maxZoom: 19 }).addTo(map);
      Leaflet.control.zoom({ position: "topright" }).addTo(map);

      const icon = Leaflet.divIcon({
        html: PICKER_PIN_SVG,
        className: "picker-pin",
        iconSize: [36, 48],
        iconAnchor: [18, 48],
      });

      const marker = Leaflet.marker(center, {
        icon,
        draggable: true,
      }).addTo(map);

      marker.on("dragend", function () {
        const pos = marker.getLatLng();
        onMoveRef.current(pos.lat, pos.lng);
      });

      map.on("click", function (e: L.LeafletMouseEvent) {
        marker.setLatLng(e.latlng);
        onMoveRef.current(e.latlng.lat, e.latlng.lng);
      });

      mapRef.current = map;
      markerRef.current = marker;
    });
  }, []);

  useEffect(() => {
    if (!mapRef.current || !markerRef.current) return;
    if (latitude == null || longitude == null) return;

    const target: [number, number] = [latitude, longitude];
    markerRef.current.setLatLng(target);
    mapRef.current.setView(target, mapRef.current.getZoom());
  }, [latitude, longitude]);

  return callbackRef;
}
