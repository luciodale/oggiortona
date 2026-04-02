import { usePushSubscription } from "../../hooks/usePushSubscription";
import { useLocale } from "../../i18n/useLocale";

export function PushToggle() {
  const { t } = useLocale();
  const { state, busy, subscribe, unsubscribe } = usePushSubscription();

  if (state === "loading" || state === "unsupported") return null;

  const isOn = state === "subscribed";

  return (
    <button
      type="button"
      disabled={busy || state === "denied"}
      onClick={isOn ? unsubscribe : subscribe}
      aria-pressed={isOn}
      aria-busy={busy}
      className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-all ${
        state === "denied"
          ? "cursor-not-allowed bg-surface-warm text-muted"
          : isOn
            ? "bg-emerald-50 text-emerald-700"
            : "bg-surface-warm text-muted hover:bg-surface-warm/80"
      }`}
    >
      {state === "denied" && t("push.denied")}
      {state === "subscribed" && (busy ? t("push.deactivating") : t("push.generalOn"))}
      {state === "unsubscribed" && (busy ? t("push.activating") : t("push.generalOff"))}
    </button>
  );
}
