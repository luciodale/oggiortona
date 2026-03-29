import { Link, useParams } from "@tanstack/react-router";
import { restaurantTypeLabels } from "../../config/categories";
import { useRestaurantDetail } from "../../hooks/useRestaurantDetail";
import { ArrowLeftIcon } from "../../icons/ArrowLeftIcon";
import { formatSchedule, getDayLabel, getOrderedDays } from "../../utils/time";
import { RestaurantCardPreview } from "../restaurants/RestaurantCardPreview";

export function ProfileRestaurantPreview() {
  const { id } = useParams({ strict: false });
  const { restaurant, loading } = useRestaurantDetail(id);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-accent" />
      </div>
    );
  }

  if (!restaurant) {
    return <p className="py-12 text-center text-sm text-muted">Locale non trovato</p>;
  }

  const days = getOrderedDays();

  return (
    <div>
      <Link
        to="/"
        className="mb-4 inline-flex items-center gap-1 text-xs font-medium text-muted no-underline hover:text-primary"
      >
        <ArrowLeftIcon className="h-3.5 w-3.5" />
        Profilo
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-family-display text-2xl font-medium leading-tight text-primary">
            {restaurant.name}
          </h1>
          <div className="mt-1 flex items-center gap-2 text-[11px] text-muted">
            <span className="capitalize">
              {restaurant.types.map((t) => restaurantTypeLabels[t] ?? t).join(" · ")}
            </span>
            <span aria-hidden="true">&middot;</span>
            <span>
              {[1, 2, 3].map((i) => (
                <span key={i} className={i <= restaurant.priceRange ? "text-primary" : "text-border"}>
                  &euro;
                </span>
              ))}
            </span>
          </div>
        </div>
        <span
          className={`mt-0.5 flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
            restaurant.isOpen ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${restaurant.isOpen ? "bg-success" : "bg-danger"}`}
            aria-hidden="true"
          />
          {restaurant.isOpen ? "Aperto" : "Chiuso"}
        </span>
      </div>

      <div className="mt-3 flex gap-2">
        <Link
          to="/restaurant/$id/edit"
          params={{ id: String(restaurant.id) }}
          className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1.5 text-[11px] font-semibold text-accent no-underline transition-colors hover:bg-accent/20"
        >
          Modifica
        </Link>
        <Link
          to="/restaurant/$id/storefront"
          params={{ id: String(restaurant.id) }}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-[11px] font-semibold text-primary no-underline transition-colors hover:bg-primary/20"
        >
          Vetrina
        </Link>
      </div>

      {restaurant.description && (
        <p className="mt-3 text-[13px] leading-relaxed text-muted">{restaurant.description}</p>
      )}

      {/* Action buttons */}
      <div className="mt-5 flex gap-2">
        {restaurant.phone && (
          <a
            href={`https://wa.me/${restaurant.phone.replace(/[\s\-+()]/g, "")}?text=${encodeURIComponent("Da Oggi a Ortona, messaggio:")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-[13px] font-semibold text-white no-underline"
          >
            WhatsApp
          </a>
        )}
        <a
          href={
            restaurant.latitude != null && restaurant.longitude != null
              ? `https://www.google.com/maps/search/?api=1&query=${restaurant.latitude},${restaurant.longitude}`
              : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.address)}`
          }
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3 text-[13px] font-semibold text-white no-underline"
        >
          Indicazioni
        </a>
        {restaurant.phone && (
          <a
            href={`tel:${restaurant.phone}`}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-white py-3 text-[13px] font-semibold text-primary no-underline"
          >
            Chiama
          </a>
        )}
        {restaurant.menuUrl && (
          <a
            href={restaurant.menuUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-white py-3 text-[13px] font-semibold text-primary no-underline"
          >
            Menu
          </a>
        )}
      </div>

      {/* Opening hours */}
      <div className="mt-8">
        <h2 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">
          Orari
        </h2>
        <div className="rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          {days.map((day, i) => {
            const schedule = restaurant.parsedHours[day];
            return (
              <div
                key={day}
                className={`flex items-center justify-between px-4 py-3 ${
                  i < days.length - 1 ? "border-b border-border-light" : ""
                }`}
              >
                <span className="text-[13px] font-medium text-primary">
                  {getDayLabel(day)}
                </span>
                <span className={`text-[13px] ${schedule ? "text-muted" : "text-danger/60"}`}>
                  {formatSchedule(schedule)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Address */}
      <div className="mt-8">
        <h2 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">
          Indirizzo
        </h2>
        <p className="text-[13px] text-primary">{restaurant.address}</p>
      </div>

      {/* Card preview */}
      <div className="mt-10 pb-4">
        <h2 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">
          Anteprima scheda
        </h2>
        <RestaurantCardPreview restaurant={restaurant} />
      </div>
    </div>
  );
}
