import { $clerkStore, $isLoadedStore } from "@clerk/astro/client";
import { useStore } from "@nanostores/react";
import { useState } from "react";

export function useLogout() {
  const clerk = useStore($clerkStore);
  const isLoaded = useStore($isLoadedStore);
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    if (!isLoaded || !clerk) return;
    setLoading(true);
    await clerk.signOut();
    window.location.href = "/";
  }

  return { loading, handleLogout };
}
