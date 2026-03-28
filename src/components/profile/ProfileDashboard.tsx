import { Link } from "@tanstack/react-router";
import { useProfileUser } from "./ProfileApp";
import { LogoutButton } from "../auth/LogoutButton";
import { ExpiredPromotionsNotice } from "./ExpiredPromotionsNotice";
import { RestaurantListCard } from "./RestaurantListCard";
import { EventListCard } from "./EventListCard";
import { CupIcon } from "../../icons/CupIcon";
import { CalendarIcon } from "../../icons/CalendarIcon";
import { useUserRestaurants } from "../../hooks/useUserRestaurants";
import { useUserEvents } from "../../hooks/useUserEvents";

export function ProfileDashboard() {
  const user = useProfileUser();
  const { restaurants, loading: loadingRestaurants } = useUserRestaurants();
  const { events, loading: loadingEvents } = useUserEvents();

  const loading = loadingRestaurants || loadingEvents;

  return (
    <div>
      <h1 className="font-[family-name:var(--font-family-display)] text-2xl font-medium tracking-tight text-primary">
        Ciao{user.name ? `, ${user.name}` : ""}!
      </h1>
      {user.email && <p className="mt-1 text-sm text-muted">{user.email}</p>}

      <div className="mt-6">
        <ExpiredPromotionsNotice />
      </div>

      {loading ? (
        <div className="mt-8 flex justify-center">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-accent" />
        </div>
      ) : (
        <>
          {restaurants.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">
                I tuoi locali
              </h2>
              <div className="flex flex-col gap-3">
                {restaurants.map((r) => (
                  <RestaurantListCard key={r.id} restaurant={r} />
                ))}
              </div>
            </div>
          )}

          {events.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">
                I tuoi eventi
              </h2>
              <div className="flex flex-col gap-3">
                {events.map((e) => (
                  <EventListCard key={e.id} event={e} />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <div className="mt-8 space-y-4">
        <Link
          to="/add/restaurant"
          className="flex items-center justify-center gap-2 rounded-xl bg-mangiare py-3.5 text-[13px] font-semibold text-white no-underline transition-all hover:bg-mangiare/90 active:scale-[0.98]"
        >
          <CupIcon className="h-4 w-4" />
          Aggiungi un locale
        </Link>
        <a
          href="/add/event"
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
