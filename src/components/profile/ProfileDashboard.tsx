import { Link } from "@tanstack/react-router";
import { useSetAtom } from "jotai";
import { useUserEvents } from "../../hooks/useUserEvents";
import { useUserRestaurants } from "../../hooks/useUserRestaurants";
import { useLocale, localeAtom } from "../../i18n/useLocale";
import { CalendarIcon } from "../../icons/CalendarIcon";
import { CupIcon } from "../../icons/CupIcon";
import { LogoutButton } from "../auth/LogoutButton";
import { ContentLoader } from "../shared/ContentLoader";
import { PushToggle } from "../shared/PushToggle";
import { EventListCard } from "./EventListCard";
import { ExpiredPromotionsNotice } from "./ExpiredPromotionsNotice";
import { useSpaAuth } from "../../hooks/useSpaAuth";
import { RestaurantListCard } from "./RestaurantListCard";
import type { Locale } from "../../types/domain";

export function ProfileDashboard() {
  const { locale, t } = useLocale();
  const setLocale = useSetAtom(localeAtom);
  const { user } = useSpaAuth();
  const { restaurants, loading: loadingRestaurants } = useUserRestaurants();
  const { events, loading: loadingEvents } = useUserEvents();

  const loading = loadingRestaurants || loadingEvents;

  return (
    <div>
      <h1 className="font-family-display text-2xl font-medium tracking-tight text-primary">
        {t("profile.hello")}{user?.name ? `, ${user.name}` : ""}!
      </h1>
      {user?.email && <p className="mt-1 text-sm text-muted">{user.email}</p>}

      <div className="mt-4 flex items-center gap-3">
        <label htmlFor="locale-select" className="text-sm font-medium text-muted">
          {t("lang.label")}
        </label>
        <select
          id="locale-select"
          value={locale}
          onChange={(e) => {
            const newLocale = e.target.value as Locale;
            document.cookie = `locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
            setLocale(newLocale);
          }}
          className="rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-primary"
        >
          <option value="it">{t("lang.italian")}</option>
          <option value="en">{t("lang.english")}</option>
        </select>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <PushToggle
          scope="general"
          labelOn={t("push.generalOn")}
          labelOff={t("push.generalOff")}
          labelDenied={t("push.denied")}
          labelActivating={t("push.activating")}
          labelDeactivating={t("push.deactivating")}
        />
        {restaurants.length > 0 && (
          <PushToggle
            scope="owner"
            labelOn={t("push.ownerOn")}
            labelOff={t("push.ownerOff")}
            labelDenied={t("push.denied")}
            labelActivating={t("push.activating")}
            labelDeactivating={t("push.deactivating")}
          />
        )}
      </div>

      <div className="mt-6">
        <ExpiredPromotionsNotice />
      </div>

      {loading ? (
        <ContentLoader className="mt-8" />
      ) : (
        <>
          {restaurants.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">
                {t("profile.yourVenues")}
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
                {t("profile.yourEvents")}
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
          to="/profile/add/restaurant"
          className="flex items-center justify-center gap-2 rounded-xl bg-mangiare py-3.5 text-[13px] font-semibold text-white no-underline transition-all hover:bg-mangiare/90 active:scale-[0.98]"
        >
          <CupIcon className="h-4 w-4" />
          {t("profile.addVenue")}
        </Link>
        <Link
          to="/add/event"
          className="flex items-center justify-center gap-2 rounded-xl bg-fare py-3.5 text-[13px] font-semibold text-white no-underline transition-all hover:bg-fare/90 active:scale-[0.98]"
        >
          <CalendarIcon className="h-4 w-4" />
          {t("profile.addEvent")}
        </Link>
      </div>

      <div className="mt-8">
        <LogoutButton />
      </div>
    </div>
  );
}
