import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { restaurantTypeLabels } from "../../config/categories";
import { CalendarIcon } from "../../icons/CalendarIcon";
import { CupIcon } from "../../icons/CupIcon";
import type { RestaurantWithStatus } from "../../types/domain";
import { LogoutButton } from "../auth/LogoutButton";
import { useProfiloUser } from "./ProfiloApp";

export function ProfiloDashboard() {
  const user = useProfiloUser();
  const [restaurants, setRestaurants] = useState<Array<RestaurantWithStatus>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/my-restaurants")
      .then((res) => res.json() as Promise<{ restaurants: Array<RestaurantWithStatus> }>)
      .then((data) => setRestaurants(data.restaurants))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="font-family-display text-2xl font-medium tracking-tight text-primary">
        Ciao{user.name ? `, ${user.name}` : ""}!
      </h1>
      {user.email && <p className="mt-1 text-sm text-muted">{user.email}</p>}

      {/* My restaurants */}
      {loading ? (
        <div className="mt-8 flex justify-center">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-accent" />
        </div>
      ) : restaurants.length > 0 ? (
        <div className="mt-8">
          <h2 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">
            I tuoi locali
          </h2>
          <div className="flex flex-col gap-3">
            {restaurants.map((r) => (
              <div key={r.id} className="rounded-2xl bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <p className="font-family-display text-base font-medium text-primary">
                  {r.name}
                </p>
                <p className="mt-0.5 text-[11px] capitalize text-muted">
                  {r.types.map((t) => restaurantTypeLabels[t] ?? t).join(" · ")}
                </p>
                <div className="mt-3 flex gap-3">
                  <Link
                    to="/locale/$id"
                    params={{ id: String(r.id) }}
                    className="text-[12px] font-semibold text-muted no-underline transition-colors hover:text-primary"
                  >
                    Anteprima
                  </Link>
                  <Link
                    to="/locale/$id/modifica"
                    params={{ id: String(r.id) }}
                    className="text-[12px] font-semibold text-accent no-underline transition-colors hover:text-accent-hover"
                  >
                    Modifica
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Add buttons */}
      <div className="mt-8 space-y-4">
        <Link
          to="/aggiungi/locale"
          className="flex items-center justify-center gap-2 rounded-xl bg-mangiare py-3.5 text-[13px] font-semibold text-white no-underline transition-all hover:bg-mangiare/90 active:scale-[0.98]"
        >
          <CupIcon className="h-4 w-4" />
          Aggiungi un locale
        </Link>
        <a
          href="/aggiungi/evento"
          className="flex items-center justify-center gap-2 rounded-xl bg-fare py-3.5 text-[13px] font-semibold text-white no-underline transition-all hover:bg-fare/90 active:scale-[0.98]"
        >
          <CalendarIcon className="h-4 w-4" />
          Aggiungi un evento
        </a>
      </div>

      <div className="mt-8">
        <LogoutButton />
      </div>
    </div>
  );
}
