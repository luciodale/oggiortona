import { $signInStore, $isLoadedStore } from "@clerk/astro/client";
import type { OAuthStrategy } from "@clerk/types";
import { useStore } from "@nanostores/react";
import { useState, useEffect } from "react";
import { getRedirectUrl } from "../utils/url";

export function useOAuthSignIn() {
  const signIn = useStore($signInStore);
  const isLoaded = useStore($isLoadedStore);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(function resetOnReturn() {
    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        setLoading(false);
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  async function handleGoogle() {
    if (!isLoaded || !signIn) return;
    setLoading(true);
    setError("");

    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google" as OAuthStrategy,
        redirectUrl: "/sign-in/sso-callback",
        redirectUrlComplete: getRedirectUrl(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore di accesso");
      setLoading(false);
    }
  }

  return { loading, error, handleGoogle };
}
