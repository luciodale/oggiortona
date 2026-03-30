import { Link } from "@tanstack/react-router";
import { useLocale } from "../i18n/useLocale";
import { useSpaAuth } from "../hooks/useSpaAuth";
import { useHomeData } from "../hooks/useHomeData";
import { ContentLoader } from "../components/shared/ContentLoader";
import { CalendarIcon } from "../icons/CalendarIcon";
import { ChevronRightIcon } from "../icons/ChevronRightIcon";
import { ClockIcon } from "../icons/ClockIcon";
import { CupIcon } from "../icons/CupIcon";
import { StarIcon } from "../icons/StarIcon";
import { TagIcon } from "../icons/TagIcon";
import { DAY_NAMES, MONTH_NAMES_LOWER as MONTH_NAMES } from "../i18n/t";
import { getNowInItaly } from "../utils/time";

export function HomeRoute() {
  const { t, locale } = useLocale();
  const { user } = useSpaAuth();
  const { data, isLoading } = useHomeData();

  const d = getNowInItaly();

  if (isLoading || !data) {
    return <ContentLoader />;
  }

  const { restaurantCount, specials, deals, newsCount, todayEvents, upcomingEvents } = data;

  return (
    <div className="flex flex-col py-6">
      <p className="mb-4 text-center text-[10px] italic tracking-wide text-muted/40">made by Lucio D'Alessandro</p>
      <div className="animate-fade-up">
        <div className="flex items-end justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/icon.svg" alt="Oggi a Ortona" width="52" height="52" className="shrink-0 rounded-xl" />
            <h1 className="font-family-display text-[2.25rem] font-medium leading-[1.1] tracking-tight text-primary">
              {t("home.whatHappens")}<br /><em className="text-accent">{t("home.today")}</em>
            </h1>
          </div>
          <div className="shrink-0 rounded-2xl bg-surface-warm px-4 py-3 text-right">
            <p className="font-family-display text-[2rem] font-semibold leading-none text-primary">{d.getDate()}</p>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">{MONTH_NAMES[locale][d.getMonth()]}</p>
            <p className="text-[10px] capitalize text-muted/60">{DAY_NAMES[locale][d.getDay()]}</p>
          </div>
        </div>
      </div>

      <nav className="flex flex-col gap-4 pt-10 stagger-children" aria-label={t("home.mainSections")}>
        <Link to="/restaurants" className="group relative overflow-hidden rounded-2xl bg-mangiare-light p-5 no-underline transition-all active:scale-[0.98]">
          <div className="absolute right-4 top-4 font-family-display text-[4rem] font-bold leading-none text-mangiare/[0.06]" aria-hidden="true">{t("home.restaurantsInitial")}</div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-mangiare/60">{t("home.whereToEat")}</span>
          <h2 className="mt-1 font-family-display text-2xl font-medium text-primary">{t("nav.restaurants")}</h2>
          <p className="mt-1.5 text-sm text-muted">{t("home.venuesInOrtona", { count: restaurantCount })}</p>
          {(specials > 0 || deals > 0 || newsCount > 0) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {specials > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-mangiare/10 px-2.5 py-1 text-xs font-medium text-mangiare">
                  <StarIcon className="h-3 w-3" strokeWidth={2.5} />
                  {specials === 1 ? t("home.specialOne", { count: specials }) : t("home.specialMany", { count: specials })}
                </span>
              )}
              {deals > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-mangiare/10 px-2.5 py-1 text-xs font-medium text-mangiare">
                  <TagIcon className="h-3 w-3" strokeWidth={2.5} />
                  {deals === 1 ? t("home.dealOne", { count: deals }) : t("home.dealMany", { count: deals })}
                </span>
              )}
              {newsCount > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/10 px-2.5 py-1 text-xs font-medium text-sky-600">
                  <StarIcon className="h-3 w-3" strokeWidth={2.5} />
                  {t("home.newsCount", { count: newsCount })}
                </span>
              )}
            </div>
          )}
          <div className="mt-3 flex items-center gap-1 text-xs font-medium text-mangiare">
            {t("common.explore")}
            <ChevronRightIcon className="h-3 w-3 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
          </div>
        </Link>

        <Link to="/events" className="group relative overflow-hidden rounded-2xl bg-fare-light p-5 no-underline transition-all active:scale-[0.98]">
          <div className="absolute right-4 top-4 font-family-display text-[4rem] font-bold leading-none text-fare/[0.06]" aria-hidden="true">{t("home.eventsInitial")}</div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-fare/60">{t("home.whatToDo")}</span>
          <h2 className="mt-1 font-family-display text-2xl font-medium text-primary">{t("nav.events")}</h2>
          {todayEvents > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-fare/10 px-2.5 py-1 text-xs font-medium text-fare">
                <ClockIcon className="h-3 w-3" strokeWidth={2.5} />
                {todayEvents === 1 ? t("home.eventTodayOne", { count: todayEvents }) : t("home.eventTodayMany", { count: todayEvents })}
              </span>
            </div>
          ) : (
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-fare/10 px-2.5 py-1 text-xs font-medium text-fare">
                <CalendarIcon className="h-3 w-3" strokeWidth={2.5} />
                {upcomingEvents > 0
                  ? upcomingEvents === 1 ? t("home.eventUpcomingOne", { count: upcomingEvents }) : t("home.eventUpcomingMany", { count: upcomingEvents })
                  : t("home.discoverEvents")}
              </span>
            </div>
          )}
          <div className="mt-3 flex items-center gap-1 text-xs font-medium text-fare">
            {t("common.discover")}
            <ChevronRightIcon className="h-3 w-3 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
          </div>
        </Link>

        {user ? (
          <div className="rounded-2xl border-2 border-dashed border-border bg-white p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">{t("home.haveVenueOrEvent")}</p>
            <p className="mt-1 font-family-display text-lg font-medium text-primary">{t("home.addToOrtona")}</p>
            <div className="mt-5 flex gap-3">
              <Link to="/profile/add/restaurant" className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-mangiare py-3 text-[13px] font-semibold text-white no-underline transition-all hover:bg-mangiare/90 active:scale-[0.98]">
                <CupIcon className="h-4 w-4" />{t("home.venue")}
              </Link>
              <Link to="/add/event" className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-fare py-3 text-[13px] font-semibold text-white no-underline transition-all hover:bg-fare/90 active:scale-[0.98]">
                <CalendarIcon className="h-4 w-4" />{t("home.event")}
              </Link>
            </div>
          </div>
        ) : (
          <Link to="/sign-in" search={{ redirect_url: "/" }} className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-white p-5 no-underline transition-all active:scale-[0.98]">
            <p className="text-center">
              <span className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">{t("home.haveVenueOrEvent")}</span>
              <span className="mt-1 block font-family-display text-lg font-medium text-accent">{t("home.signInToPublish")}</span>
            </p>
          </Link>
        )}
      </nav>
    </div>
  );
}
