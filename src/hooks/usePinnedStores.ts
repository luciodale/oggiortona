import { useState, useCallback } from "react";

export function usePinnedStores(initialIds: Array<number>) {
  const [pinnedIds, setPinnedIds] = useState<Set<number>>(() => new Set(initialIds));

  const togglePin = useCallback(function togglePin(id: number) {
    setPinnedIds((prev) => {
      const next = new Set(prev);
      const wasPinned = next.has(id);
      if (wasPinned) next.delete(id);
      else next.add(id);

      fetch("/api/store-pins", {
        method: wasPinned ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeId: id }),
      }).catch(() => {});

      return next;
    });
  }, []);

  return { pinnedIds, togglePin };
}
