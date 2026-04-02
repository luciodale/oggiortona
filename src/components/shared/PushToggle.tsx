import { usePushSubscription } from "../../hooks/usePushSubscription";
import { useLocale } from "../../i18n/useLocale";
import { BellIcon } from "../../icons/BellIcon";
import { BellOffIcon } from "../../icons/BellOffIcon";

export function PushToggle() {
  const { t } = useLocale();
  const { state, busy, subscribe, unsubscribe } = usePushSubscription();

  if (state === "loading" || state === "unsupported") return null;

  const isOn = state === "subscribed";
  const Icon = isOn ? BellIcon : BellOffIcon;

  return (
    <button
      type="button"
      disabled={busy || state === "denied"}
      onClick={isOn ? unsubscribe : subscribe}
      aria-pressed={isOn}
      aria-busy={busy}
      className={`shrink-0 flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-[12px] font-semibold shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-colors active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed ${
        state === "denied"
          ? "cursor-not-allowed text-muted/40"
          : isOn
            ? "text-accent hover:bg-accent/5"
            : "text-muted hover:bg-surface-alt"
      }`}
    >
      {busy ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <Icon className="h-4 w-4" strokeWidth={2} />
      )}
      {state === "denied" ? t("push.denied") : t("push.generalOn")}
    </button>
  );
}
