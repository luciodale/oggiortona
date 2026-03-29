import { useState, useCallback } from "react";

export function useRefresh() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async function handleRefresh() {
    setIsRefreshing(true);
    const reg = await navigator.serviceWorker?.getRegistration();
    if (reg) await reg.update();
    window.location.reload();
  }, []);

  return { isRefreshing, handleRefresh };
}
