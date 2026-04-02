import { $signInStore, $isLoadedStore } from "@clerk/astro/client";
import type { OAuthStrategy } from "@clerk/types";
import { useStore } from "@nanostores/react";
import { useState, useEffect } from "react";
import { useLocale } from "../i18n/useLocale";
import { getRedirectUrl } from "../utils/url";

function extractClerkMessage(err: unknown): string | null {
  const clerkError = err as { errors?: Array<{ message: string; longMessage?: string }> };
  if (clerkError.errors?.length) {
    return clerkError.errors.map((e) => e.longMessage ?? e.message).join(". ");
  }
  if (err instanceof Error) return err.message;
  return null;
}

export function useOAuthSignIn() {
  const signIn = useStore($signInStore);
  const isLoaded = useStore($isLoadedStore);
  const { t } = useLocale();
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
    if (!isLoaded || !signIn) {
      setError(!isLoaded ? t("auth.notLoaded") : t("auth.notInitialized"));
      return;
    }
    setLoading(true);
    setError("");

    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google" as OAuthStrategy,
        redirectUrl: "/sign-in/sso-callback",
        redirectUrlComplete: getRedirectUrl(),
      });
    } catch (err) {
      setError(extractClerkMessage(err) ?? t("auth.genericError"));
      setLoading(false);
    }
  }

  return { loading, error, handleGoogle };
}
