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
      className="shrink-0 rounded-lg bg-white px-3 py-1.5 text-[12px] font-semibold text-danger shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-colors hover:bg-danger/5 active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? t("auth.signingOut") : t("auth.signOut")}
    </button>
  );
}
