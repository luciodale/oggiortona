import { useState, useEffect, useCallback } from "react";

type BroadcastState = {
  subscriberCount: number;
  loading: boolean;
  sending: boolean;
  result: { sent: number; failed: number } | null;
  error: string | null;
};

export function useBroadcast() {
  const [state, setState] = useState<BroadcastState>({
    subscriberCount: 0,
    loading: true,
    sending: false,
    result: null,
    error: null,
  });

  useEffect(() => {
    async function fetchCount() {
      try {
        const res = await fetch("/api/admin/push/subscriber-count");
        if (res.ok) {
          const { count } = await res.json() as { count: number };
          setState((prev) => ({ ...prev, subscriberCount: count, loading: false }));
        } else {
          setState((prev) => ({ ...prev, loading: false }));
        }
      } catch {
        setState((prev) => ({ ...prev, loading: false }));
      }
    }
    fetchCount();
  }, []);

  const send = useCallback(async (title: string, body: string) => {
    setState((prev) => ({ ...prev, sending: true, result: null, error: null }));
    try {
      const res = await fetch("/api/admin/push/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body }),
      });

      if (!res.ok) {
        const data = await res.json() as { error: string };
        setState((prev) => ({ ...prev, sending: false, error: data.error }));
        return;
      }

      const result = await res.json() as { sent: number; failed: number };
      setState((prev) => ({ ...prev, sending: false, result }));
    } catch {
      setState((prev) => ({ ...prev, sending: false, error: "Errore di rete" }));
    }
  }, []);

  return { ...state, send };
}
