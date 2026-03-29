import { Link } from "@tanstack/react-router";
import { useExpiredPromotions } from "../../hooks/useExpiredPromotions";

const KIND_LABELS: Record<string, string> = {
  special: "Piatto",
  deal: "Offerta",
  news: "News",
};

const KIND_COLORS: Record<string, string> = {
  special: "bg-mangiare-light text-mangiare",
  deal: "bg-violet-50 text-violet-700",
  news: "bg-sky-50 text-sky-700",
};

export function ExpiredPromotionsNotice() {
  const { notifications, loading } = useExpiredPromotions();

  if (loading || notifications.length === 0) return null;

  return (
    <div className="rounded-2xl border border-dashed border-danger/30 bg-danger/5 p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-danger">
        {notifications.length} {notifications.length === 1 ? "promozione scaduta" : "promozioni scadute"}
      </p>
      <div className="mt-3 flex flex-col gap-2">
        {notifications.map((n) => (
          <Link
            key={`${n.kind}-${n.id}`}
            to="/profile/restaurant/$id/storefront"
            params={{ id: String(n.restaurantId) }}
            className="flex items-center justify-between gap-2 rounded-xl bg-white px-3 py-2.5 no-underline transition-all hover:bg-surface-alt active:scale-[0.98]"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${KIND_COLORS[n.kind]}`}>
                  {KIND_LABELS[n.kind]}
                </span>
                <span className="text-[11px] text-muted">{n.restaurantName}</span>
              </div>
              <p className="mt-0.5 truncate text-[13px] font-medium text-primary">{n.label}</p>
            </div>
            <span className="shrink-0 text-[11px] font-semibold text-accent">Rinnova</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
