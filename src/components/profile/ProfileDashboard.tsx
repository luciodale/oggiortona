import { useSetAtom } from "jotai";
import { useEffect, useMemo, useState } from "react";
import { useDeleteAccount } from "../../hooks/useDeleteAccount";
import { useFormSheet } from "../../hooks/useFormSheet";
import { useSpaAuth } from "../../hooks/useSpaAuth";
import { useUserEvents } from "../../hooks/useUserEvents";
import { useUserRestaurants } from "../../hooks/useUserRestaurants";
import { useUserStores } from "../../hooks/useUserStores";
import { localeAtom, useLocale } from "../../i18n/useLocale";
import { CalendarIcon } from "../../icons/CalendarIcon";
import { ChevronDownIcon } from "../../icons/ChevronDownIcon";
import { CupIcon } from "../../icons/CupIcon";
import { ShopIcon } from "../../icons/ShopIcon";
import type { Locale } from "../../types/domain";
import { getTodayISO } from "../../utils/date";
import { LogoutButton } from "../auth/LogoutButton";
import { ContentLoader } from "../shared/ContentLoader";
import { PushToggle } from "../shared/PushToggle";
import { EventListCard } from "./EventListCard";
import { PastEventsList } from "./PastEventsList";
import { RestaurantListCard } from "./RestaurantListCard";
import { StoreListCard } from "./StoreListCard";

type ThemePreference = "system" | "light" | "dark";

function getStoredTheme(): ThemePreference {
  const stored = localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") return stored;
  return "system";
}

function applyTheme(pref: ThemePreference) {
  localStorage.setItem("theme", pref);
  const dark = pref === "dark" || (pref === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
  window.dispatchEvent(new Event("themechange"));
}

export function ProfileDashboard() {
  const { locale, t } = useLocale();
  const setLocale = useSetAtom(localeAtom);
  const { user } = useSpaAuth();
  const { restaurants, loading: loadingRestaurants } = useUserRestaurants();
  const { stores, loading: loadingStores } = useUserStores();
  const { events, loading: loadingEvents } = useUserEvents();
  const [theme, setTheme] = useState<ThemePreference>(getStoredTheme);

  useEffect(() => {
    function onSystemChange() {
      if (getStoredTheme() !== "system") return;
      const dark = matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.toggle("dark", dark);
      window.dispatchEvent(new Event("themechange"));
    }
    const mql = matchMedia("(prefers-color-scheme: dark)");
    mql.addEventListener("change", onSystemChange);
    return () => mql.removeEventListener("change", onSystemChange);
  }, []);

  const { openRestaurantForm, openStoreForm, openEventForm } = useFormSheet();
  const { confirmDelete, loading: deleting } = useDeleteAccount();
  const loading = loadingRestaurants || loadingStores || loadingEvents;

  const { activeEvents, pastEvents } = useMemo(() => {
    const today = getTodayISO();
    const active = events.filter((e) => (e.dateEnd ?? e.dateStart) >= today);
    const past = events.filter((e) => (e.dateEnd ?? e.dateStart) < today);
    return { activeEvents: active, pastEvents: past };
  }, [events]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="font-family-display text-2xl font-medium tracking-tight text-primary">
              {t("profile.hello")}{user?.name ? `, ${user.name}` : ""}!
            </h1>
            {user?.email && <p className="mt-1 text-sm text-muted">{user.email}</p>}
          </div>
          <LogoutButton />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                id="locale-select"
                value={locale}
                onChange={(e) => {
                  const newLocale = e.target.value as Locale;
                  document.cookie = `locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
                  setLocale(newLocale);
                }}
                className="appearance-none rounded-lg border border-border bg-card py-1.5 pl-3 pr-8 text-sm text-primary"
              >
                <option value="it">{t("lang.italian")}</option>
                <option value="en">{t("lang.english")}</option>
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" strokeWidth={2.5} />
            </div>
            <div className="relative">
              <select
                id="theme-select"
                value={theme}
                onChange={(e) => {
                  const pref = e.target.value as ThemePreference;
                  setTheme(pref);
                  applyTheme(pref);
                }}
                className="appearance-none rounded-lg border border-border bg-card py-1.5 pl-3 pr-8 text-sm text-primary"
              >
                <option value="system">{t("theme.system")}</option>
                <option value="light">{t("theme.light")}</option>
                <option value="dark">{t("theme.dark")}</option>
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" strokeWidth={2.5} />
            </div>
          </div>
          <PushToggle />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => openRestaurantForm()}
            className="flex items-center justify-center gap-2 rounded-xl bg-mangiare py-3 text-[13px] font-semibold text-white transition-all hover:bg-mangiare/90 active:scale-[0.98]"
          >
            <CupIcon className="h-4 w-4" />
            {t("profile.addVenue")}
          </button>
          <button
            type="button"
            onClick={() => openStoreForm()}
            className="flex items-center justify-center gap-2 rounded-xl bg-stores py-3 text-[13px] font-semibold text-white transition-all hover:bg-stores/90 active:scale-[0.98]"
          >
            <ShopIcon className="h-4 w-4" />
            {t("profile.addStore")}
          </button>
          <button
            type="button"
            onClick={() => openEventForm()}
            className="col-span-2 flex items-center justify-center gap-2 rounded-xl bg-fare py-3 text-[13px] font-semibold text-white transition-all hover:bg-fare/90 active:scale-[0.98]"
          >
            <CalendarIcon className="h-4 w-4" />
            {t("profile.addEvent")}
          </button>
         
        </div>
      </div>

      {loading ? (
        <ContentLoader />
      ) : (
        <>
          {restaurants.length > 0 && (
            <section>
              <h2 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">
                {t("profile.yourVenues")}
              </h2>
              <div className="flex flex-col gap-3">
                {restaurants.map((r) => (
                  <RestaurantListCard key={r.id} restaurant={r} />
                ))}
              </div>
            </section>
          )}

          {stores.length > 0 && (
            <section>
              <h2 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">
                {t("profile.yourStores")}
              </h2>
              <div className="flex flex-col gap-3">
                {stores.map((s) => (
                  <StoreListCard key={s.id} store={s} />
                ))}
              </div>
            </section>
          )}

          {activeEvents.length > 0 && (
            <section>
              <h2 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">
                {t("profile.yourEvents")}
              </h2>
              <div className="flex flex-col gap-3">
                {activeEvents.map((e) => (
                  <EventListCard key={e.id} event={e} />
                ))}
              </div>
            </section>
          )}

          <PastEventsList events={pastEvents} />
        </>
      )}

      <div className="border-t border-border-light pt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-muted">
        <a
          href="/api/profile/export"
          className="hover:text-primary transition-colors"
        >
          {t("profile.exportData")}
        </a>
        <span aria-hidden="true">·</span>
        <a href="/terms" className="hover:text-primary transition-colors">
          {t("auth.terms")}
        </a>
        <span aria-hidden="true">·</span>
        <a href="/privacy" className="hover:text-primary transition-colors">
          {t("auth.privacy")}
        </a>
        <span aria-hidden="true">·</span>
        <button
          type="button"
          onClick={confirmDelete}
          disabled={deleting}
          className="text-danger hover:text-danger/80 transition-colors disabled:opacity-50"
        >
          {t("profile.deleteAccount")}
        </button>
      </div>
    </div>
  );
}
