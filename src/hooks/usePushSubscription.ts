import { useState, useEffect, useCallback } from "react";

type PushState = "loading" | "unsupported" | "denied" | "subscribed" | "unsubscribed";

export function usePushSubscription() {
  const [state, setState] = useState<PushState>("loading");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setState("unsupported");
      return;
    }

    async function check() {
      const permission = Notification.permission;
      if (permission === "denied") {
        setState("denied");
        return;
      }

      const reg = await navigator.serviceWorker.ready;
      const existing = await reg.pushManager.getSubscription();
      setState(existing ? "subscribed" : "unsubscribed");
    }

    check();
  }, []);

  const subscribe = useCallback(async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/push/vapid-public-key");
      if (!res.ok) throw new Error("Impossibile ottenere chiave VAPID");
      const { publicKey } = await res.json() as { publicKey: string };

      const reg = await navigator.serviceWorker.ready;
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      const subJson = subscription.toJSON();
      const saveRes = await fetch("/api/admin/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: subJson.endpoint,
          keys: subJson.keys,
        }),
      });

      if (!saveRes.ok) throw new Error("Impossibile salvare sottoscrizione");
      setState("subscribed");
    } catch (err) {
      console.error("Push subscribe failed:", err);
      if (Notification.permission === "denied") setState("denied");
    } finally {
      setBusy(false);
    }
  }, []);

  const unsubscribe = useCallback(async () => {
    setBusy(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      const subscription = await reg.pushManager.getSubscription();
      if (subscription) {
        await fetch("/api/admin/push/unsubscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        });
        await subscription.unsubscribe();
      }
      setState("unsubscribed");
    } catch (err) {
      console.error("Push unsubscribe failed:", err);
    } finally {
      setBusy(false);
    }
  }, []);

  return { state, busy, subscribe, unsubscribe };
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) output[i] = raw.charCodeAt(i);
  return output;
}
