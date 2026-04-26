import { $clerkStore, $isLoadedStore } from "@clerk/astro/client";
import { useStore } from "@nanostores/react";
import { useSetAtom } from "jotai";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useLocale } from "../i18n/useLocale";
import { authAtom } from "./useSpaAuth";

export function useDeleteAccount() {
  const { t } = useLocale();
  const clerk = useStore($clerkStore);
  const isLoaded = useStore($isLoadedStore);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useSetAtom(authAtom);

  async function deleteAccount() {
    if (!isLoaded || !clerk) return;
    setLoading(true);
    try {
      const res = await fetch("/api/profile", { method: "DELETE" });
      if (!res.ok) {
        toast.error(t("profile.deleteError"));
        setLoading(false);
        return;
      }
      // Server already deleted the Clerk user when possible; sign out client-side
      // to clear the session token and atoms, then go home.
      await clerk.signOut().catch(() => {});
      setAuth({ user: null, isAdmin: false });
      toast.success(t("profile.deleteSuccess"));
      navigate({ to: "/" });
    } catch {
      toast.error(t("profile.deleteError"));
      setLoading(false);
    }
  }

  function confirmDelete() {
    toast(t("profile.deleteConfirm"), {
      duration: Infinity,
      action: { label: t("profile.deleteConfirmAction"), onClick: deleteAccount },
      cancel: { label: t("common.cancel"), onClick: () => {} },
    });
  }

  return { loading, confirmDelete };
}
