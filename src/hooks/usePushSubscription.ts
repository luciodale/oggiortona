import { useState, useEffect, useCallback } from "react";
import { urlBase64ToUint8Array } from "../utils/base64";

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
      if (Notification.permission === "denied") {
        setState("denied");
        return;
      }

      const res = await fetch("/api/push/status?scope=general");
      if (res.ok) {
        const { subscribed } = await res.json() as { subscribed: boolean };
        setState(subscribed ? "subscribed" : "unsubscribed");
      } else {
        setState("unsubscribed");
      }
    }

    check();
  }, []);

  const subscribe = useCallback(async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/push/vapid-public-key");
      if (!res.ok) throw new Error("Impossibile ottenere chiave VAPID");
      const { publicKey } = await res.json() as { publicKey: string };

      const reg = await navigator.serviceWorker.ready;
      let subscription = await reg.pushManager.getSubscription();

      if (!subscription) {
        subscription = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        });
      }

      const subJson = subscription.toJSON();
      const saveRes = await fetch("/api/push/auto-enroll", {
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
        await fetch("/api/push/unsubscribe-all", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        });
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
