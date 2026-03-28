import { useCallback, useEffect, useRef, useState } from "react";

export type AddressSuggestion = {
  label: string;
  value: string;
  latitude: number;
  longitude: number;
};

type PhotonProperties = {
  name?: string;
  street?: string;
  housenumber?: string;
  postcode?: string;
  city?: string;
  state?: string;
  country?: string;
};

type PhotonFeature = {
  type: "Feature";
  geometry: { type: "Point"; coordinates: [number, number] };
  properties: PhotonProperties;
};

type PhotonResponse = {
  type: "FeatureCollection";
  features: Array<PhotonFeature>;
};

function buildLabel(props: PhotonProperties) {
  const parts: Array<string> = [];
  if (props.street) {
    parts.push(
      props.housenumber ? `${props.street} ${props.housenumber}` : props.street,
    );
  } else if (props.name) {
    parts.push(props.name);
  }
  if (props.city) parts.push(props.city);
  if (props.postcode) parts.push(props.postcode);
  if (props.country) parts.push(props.country);
  return parts.join(", ");
}

function mapFeature(feature: PhotonFeature): AddressSuggestion {
  const { properties, geometry } = feature;
  const label = buildLabel(properties);
  return {
    label,
    value: label,
    latitude: geometry.coordinates[1],
    longitude: geometry.coordinates[0],
  };
}

const DEBOUNCE_MS = 350;
const MIN_CHARS = 3;

export function useAddressSearch(initialQuery = "") {
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<Array<AddressSuggestion>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchSuggestions = useCallback(function fetchSuggestions(q: string) {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);
    fetch(
      `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=5&lat=42.3505&lon=14.4039&location_bias_scale=5&layer=house&layer=street`,
      { signal: controller.signal },
    )
      .then((res) => res.json() as Promise<PhotonResponse>)
      .then((data) => {
        setSuggestions(data.features.map(mapFeature));
        setIsLoading(false);
      })
      .catch((err) => {
        if ((err as Error).name !== "AbortError") {
          setIsLoading(false);
        }
      });
  }, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (query.length < MIN_CHARS) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    timerRef.current = setTimeout(() => fetchSuggestions(query), DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query, fetchSuggestions]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  return { query, setQuery, suggestions, isLoading };
}
