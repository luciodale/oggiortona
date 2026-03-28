import { useState, useEffect } from "react";
import type { OpeningHours } from "../types/database";
import { isOpenNow } from "../utils/time";

export function useOpenNow(hours: OpeningHours) {
  const [open, setOpen] = useState(() => isOpenNow(hours));

  useEffect(() => {
    const interval = setInterval(() => {
      setOpen(isOpenNow(hours));
    }, 60_000);

    return () => clearInterval(interval);
  }, [hours]);

  return open;
}
