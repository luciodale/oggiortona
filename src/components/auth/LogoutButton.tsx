import { $clerkStore, $isLoadedStore } from "@clerk/astro/client";
import { useStore } from "@nanostores/react";
import { useState } from "react";
import { useLocale } from "../../i18n/useLocale";

export function LogoutButton() {
  const { t } = useLocale();
  const clerk = useStore($clerkStore);
  const isLoaded = useStore($isLoadedStore);
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    if (!isLoaded || !clerk) return;
    setLoading(true);
    await clerk.signOut();
    window.location.href = "/";
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      aria-busy={loading}
      className="w-full rounded-xl border border-border bg-white py-3 text-[13px] font-semibold text-danger transition-all hover:bg-danger/5 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? t("auth.signingOut") : t("auth.signOut")}
    </button>
  );
}
