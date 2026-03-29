import { useLogout } from "../../hooks/useLogout";
import { useLocale } from "../../i18n/useLocale";

export function LogoutButton() {
  const { t } = useLocale();
  const { loading, handleLogout } = useLogout();

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
