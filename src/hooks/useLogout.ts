import { $clerkStore, $isLoadedStore } from "@clerk/astro/client";
import { useStore } from "@nanostores/react";
import { useSetAtom } from "jotai";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { authAtom } from "./useSpaAuth";

export function useLogout() {
  const clerk = useStore($clerkStore);
  const isLoaded = useStore($isLoadedStore);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useSetAtom(authAtom);

  async function handleLogout() {
    if (!isLoaded || !clerk) return;
    setLoading(true);
    await clerk.signOut();
    setAuth({ user: null, isAdmin: false });
    navigate({ to: "/" });
  }

  return { loading, handleLogout };
}
