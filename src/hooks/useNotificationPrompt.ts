import { useState, useEffect, useCallback } from "react";
import { urlBase64ToUint8Array } from "../utils/base64";

const STORAGE_KEY = "notification-prompt-dismissed";

export function useNotificationPrompt() {
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) return;
    if (Notification.permission !== "default") return;
    if (localStorage.getItem(STORAGE_KEY)) return;
    setVisible(true);
  }, []);

  const handleEnable = useCallback(async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/push/vapid-public-key");
      if (!res.ok) return;
      const { publicKey } = (await res.json()) as { publicKey: string };

      const reg = await navigator.serviceWorker.ready;
      let subscription = await reg.pushManager.getSubscription();
      if (!subscription) {
        subscription = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        });
      }

      const subJson = subscription.toJSON();
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: subJson.endpoint,
          keys: subJson.keys,
          scope: "general",
        }),
      });
    } catch {
      // Push subscription failed
    } finally {
      setBusy(false);
      setVisible(false);
      localStorage.setItem(STORAGE_KEY, "1");
    }
  }, []);

  const handleDismiss = useCallback(() => {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, "1");
  }, []);

  return { visible, busy, handleEnable, handleDismiss };
}

