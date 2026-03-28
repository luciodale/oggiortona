import { usePushSubscription } from "../../hooks/usePushSubscription";

export function AdminPushToggle() {
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
      className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition-all ${
        state === "denied"
          ? "cursor-not-allowed bg-surface-warm text-muted"
          : isOn
            ? "bg-emerald-50 text-emerald-700"
            : "bg-surface-warm text-muted hover:bg-surface-warm/80"
      }`}
    >
      <span className="text-base" aria-hidden="true">{isOn ? "🔔" : "🔕"}</span>
      {state === "denied" && "Notifiche bloccate"}
      {state === "subscribed" && (busy ? "Disattivando..." : "Notifiche attive")}
      {state === "unsubscribed" && (busy ? "Attivando..." : "Attiva notifiche")}
    </button>
  );
}
