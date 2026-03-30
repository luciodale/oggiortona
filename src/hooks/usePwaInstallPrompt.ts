import { useCallback, useEffect, useRef, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "pwa-install-dismissed";

function isDismissedThisSession() {
  return sessionStorage.getItem(DISMISS_KEY) === "1";
}

function isStandalone() {
  if (window.matchMedia("(display-mode: standalone)").matches) return true;
  if ("standalone" in navigator && (navigator as Record<string, unknown>).standalone === true) return true;
  return false;
}

function isIos() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window);
}

export function usePwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [ready, setReady] = useState(false);
  const [showIos, setShowIos] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (isStandalone() || isDismissedThisSession()) return;

    if (isIos()) {
      timerRef.current = setTimeout(() => setShowIos(true), 7_000);
      return () => clearTimeout(timerRef.current);
    }

    function handler(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    }

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  useEffect(() => {
    if (!deferredPrompt) return;
    timerRef.current = setTimeout(() => setReady(true), 7_000);
    return () => clearTimeout(timerRef.current);
  }, [deferredPrompt]);

  const handleInstall = useCallback(
    async function handleInstall() {
      if (!deferredPrompt) return;
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setDeferredPrompt(null);
        setReady(false);
      }
    },
    [deferredPrompt],
  );

  function handleDismiss() {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setReady(false);
    setShowIos(false);
    setDeferredPrompt(null);
  }

  return {
    canInstall: ready && deferredPrompt !== null,
    showIos,
    handleInstall,
    handleDismiss,
  };
}
