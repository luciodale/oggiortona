import { useState, useRef, useEffect, useCallback } from "react";

type ViewMode = "list" | "map";

export function useViewMode() {
  const [mode, setMode] = useState<ViewMode>("list");
  const anchorRef = useRef<HTMLDivElement>(null);
  const [mapTop, setMapTop] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("vista") === "mappa") {
      setMode("map");
    }
  }, []);

  const handleToggle = useCallback(function handleToggle(next: ViewMode) {
    setMode(next);
    const url = new URL(window.location.href);
    if (next === "map") {
      url.searchParams.set("vista", "mappa");
    } else {
      url.searchParams.delete("vista");
    }
    window.history.replaceState({}, "", url.toString());
  }, []);

  useEffect(() => {
    if (mode !== "map" || !anchorRef.current) return;

    function measure() {
      if (!anchorRef.current) return;
      const rect = anchorRef.current.getBoundingClientRect();
      setMapTop(rect.bottom);
    }

    measure();
    window.addEventListener("resize", measure, { passive: true });
    return () => window.removeEventListener("resize", measure);
  }, [mode]);

  return { mode, handleToggle, anchorRef, mapTop };
}
