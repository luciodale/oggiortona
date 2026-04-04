import { Link } from "@tanstack/react-router";
import { ContentLoader } from "../components/shared/ContentLoader";
import { useHomeData } from "../hooks/useHomeData";
import { DAY_NAMES, MONTH_NAMES_LOWER as MONTH_NAMES } from "../i18n/t";
import { useLocale } from "../i18n/useLocale";
import { CalendarIcon } from "../icons/CalendarIcon";
import { ChevronRightIcon } from "../icons/ChevronRightIcon";
import { ClockIcon } from "../icons/ClockIcon";
import { CupIcon } from "../icons/CupIcon";
import { DiningIllustration } from "../icons/DiningIllustration";
import { SparkleIllustration } from "../icons/SparkleIllustration";
import { StarIcon } from "../icons/StarIcon";
import { TagIcon } from "../icons/TagIcon";
import { getNowInItaly } from "../utils/time";

export function HomeRoute() {
  const { t, locale } = useLocale();
  const { data, isLoading } = useHomeData();

  const d = getNowInItaly();

  if (isLoading || !data) {
    return <ContentLoader />;
  }

  const { restaurantCount, specials, deals, newsCount, todayEvents, upcomingEvents } = data;

  return (
    <div className="flex flex-col pt-6">
      <p className="mb-4 text-center text-[10px] italic tracking-wide text-muted/40">made by Lucio D'Alessandro</p>
      <div className="animate-fade-up">
        <div className="flex items-end justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/icon.svg" alt="Oggi a Ortona" width="52" height="52" className="shrink-0 rounded-xl" />
            <h1 className="font-family-display text-[2.25rem] font-medium leading-[1.1] tracking-tight text-primary">
              {t("home.whatHappens")}<br /><em className="text-accent">{t("home.today")}</em>
            </h1>
          </div>
          <div className="shrink-0 rounded-3xl bg-linear-to-br from-surface-warm to-border px-5 py-4 text-right shadow-[0_2px_20px_rgba(0,0,0,0.04)]">
            <p className="font-family-display text-[2.25rem] font-semibold leading-none text-primary">{d.getDate()}</p>
            <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-muted">{MONTH_NAMES[locale][d.getMonth()]}</p>
            <p className="text-[10px] capitalize text-muted/70">{DAY_NAMES[locale][d.getDay()]}</p>
          </div>
        </div>
      </div>

      <nav className="flex flex-col gap-5 pt-10 stagger-children" aria-label={t("home.mainSections")}>
        <Link to="/restaurants" className="group relative overflow-hidden rounded-3xl bg-linear-to-br from-mangiare-light via-mangiare-mid to-mangiare-deep px-6 pb-6 pt-7 no-underline shadow-[0_2px_20px_rgba(196,81,42,0.07)] transition-all hover:shadow-[0_4px_28px_rgba(196,81,42,0.13)] active:scale-[0.98]">
          <DiningIllustration className="absolute -right-4 bottom-0 h-28 w-56 text-mangiare/22" />
          <div className="relative flex items-start justify-between">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-mangiare">{t("home.whereToEat")}</span>
              <h2 className="mt-2 font-family-display text-[2.25rem] font-semibold leading-none text-primary">{t("nav.restaurants")}</h2>
            </div>
            <div className="shrink-0 rounded-2xl bg-mangiare/8 p-3.5">
              <CupIcon className="h-7 w-7 text-mangiare" strokeWidth={1.5} />
            </div>
          </div>

          <p className="mt-4 text-[15px] leading-relaxed text-muted">{t("home.venuesInOrtona", { count: restaurantCount })}</p>

          {(specials > 0 || deals > 0 || newsCount > 0) && (
            <div className="mt-5 flex flex-wrap gap-2">
              {specials > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-card/60 px-3 py-1.5 text-xs font-medium text-mangiare shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
                  <StarIcon className="h-3 w-3" strokeWidth={2.5} />
                  {specials === 1 ? t("home.specialOne", { count: specials }) : t("home.specialMany", { count: specials })}
                </span>
              )}
              {deals > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-card/60 px-3 py-1.5 text-xs font-medium text-mangiare shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
                  <TagIcon className="h-3 w-3" strokeWidth={2.5} />
                  {deals === 1 ? t("home.dealOne", { count: deals }) : t("home.dealMany", { count: deals })}
                </span>
              )}
              {newsCount > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-card/60 px-3 py-1.5 text-xs font-medium text-promo-news shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
                  <StarIcon className="h-3 w-3" strokeWidth={2.5} />
                  {t("home.newsCount", { count: newsCount })}
                </span>
              )}
            </div>
          )}

          <div className="mt-6 flex items-center gap-1.5 text-sm font-semibold text-mangiare">
            {t("common.explore")}
            <ChevronRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
          </div>
        </Link>

        <Link to="/events" className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-fare-light via-fare-mid to-fare-deep px-6 pb-6 pt-7 no-underline shadow-[0_2px_20px_rgba(61,107,142,0.07)] transition-all hover:shadow-[0_4px_28px_rgba(61,107,142,0.13)] active:scale-[0.98]">
          <SparkleIllustration className="absolute right-6 bottom-2 h-32 w-32 text-fare/[0.22]" />
          <div className="relative flex items-start justify-between">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-fare">{t("home.whatToDo")}</span>
              <h2 className="mt-2 font-family-display text-[2.25rem] font-semibold leading-none text-primary">{t("nav.events")}</h2>
            </div>
            <div className="shrink-0 rounded-2xl bg-fare/[0.08] p-3.5">
              <CalendarIcon className="h-7 w-7 text-fare" strokeWidth={1.5} />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {todayEvents > 0 ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-card/60 px-3 py-1.5 text-xs font-medium text-fare shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
                <ClockIcon className="h-3 w-3" strokeWidth={2.5} />
                {todayEvents === 1 ? t("home.eventTodayOne", { count: todayEvents }) : t("home.eventTodayMany", { count: todayEvents })}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-card/60 px-3 py-1.5 text-xs font-medium text-fare shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
                <CalendarIcon className="h-3 w-3" strokeWidth={2.5} />
                {upcomingEvents > 0
                  ? upcomingEvents === 1 ? t("home.eventUpcomingOne", { count: upcomingEvents }) : t("home.eventUpcomingMany", { count: upcomingEvents })
                  : t("home.discoverEvents")}
              </span>
            )}
          </div>

          <div className="mt-6 flex items-center gap-1.5 text-sm font-semibold text-fare">
            {t("common.discover")}
            <ChevronRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
          </div>
        </Link>
      </nav>
    </div>
  );
}
