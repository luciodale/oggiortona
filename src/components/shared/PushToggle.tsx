import { usePushSubscription } from "../../hooks/usePushSubscription";
import type { PushScope } from "../../types/domain";

type PushToggleProps = {
  scope: PushScope;
  labelOn: string;
  labelOff: string;
  labelDenied: string;
  labelActivating: string;
  labelDeactivating: string;
};

export function PushToggle({
  scope,
  labelOn,
  labelOff,
  labelDenied,
  labelActivating,
  labelDeactivating,
}: PushToggleProps) {
  const { state, busy, subscribe, unsubscribe } = usePushSubscription(scope);

  if (state === "loading" || state === "unsupported") return null;

  const isOn = state === "subscribed";

  return (
    <button
      type="button"
      disabled={busy || state === "denied"}
      onClick={isOn ? unsubscribe : subscribe}
      aria-pressed={isOn}
      aria-busy={busy}
      className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition-all ${
        state === "denied"
          ? "cursor-not-allowed bg-surface-warm text-muted"
          : isOn
            ? "bg-emerald-50 text-emerald-700"
            : "bg-surface-warm text-muted hover:bg-surface-warm/80"
      }`}
    >
      <span className="text-base" aria-hidden="true">{isOn ? "\uD83D\uDD14" : "\uD83D\uDD15"}</span>
      {state === "denied" && labelDenied}
      {state === "subscribed" && (busy ? labelDeactivating : labelOn)}
      {state === "unsubscribed" && (busy ? labelActivating : labelOff)}
    </button>
  );
}
