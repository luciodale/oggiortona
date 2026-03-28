import { $signInStore, $isLoadedStore } from "@clerk/astro/client";
import type { OAuthStrategy } from "@clerk/types";
import { useStore } from "@nanostores/react";
import { useState } from "react";
import { getRedirectUrl } from "../utils/url";

const providers: Array<{ strategy: OAuthStrategy; label: string }> = [
  { strategy: "oauth_google", label: "Google" },
  { strategy: "oauth_apple", label: "Apple" },
  { strategy: "oauth_facebook", label: "Facebook" },
];

export function useOAuthSignIn() {
  const signIn = useStore($signInStore);
  const isLoaded = useStore($isLoadedStore);
  const [loading, setLoading] = useState<OAuthStrategy | null>(null);
  const [error, setError] = useState("");

  async function handleOAuth(strategy: OAuthStrategy) {
    if (!isLoaded || !signIn) return;
    setLoading(strategy);
    setError("");

    try {
      await signIn.authenticateWithRedirect({
        strategy,
        redirectUrl: "/sign-in/sso-callback",
        redirectUrlComplete: getRedirectUrl(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore di accesso");
      setLoading(null);
    }
  }

  return { loading, error, handleOAuth, providers };
}
