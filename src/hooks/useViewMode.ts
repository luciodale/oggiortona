import { useState, useEffect, useCallback } from "react";

type ViewMode = "list" | "map";

export function useViewMode() {
  const [mode, setMode] = useState<ViewMode>("list");

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

  return { mode, handleToggle };
}
