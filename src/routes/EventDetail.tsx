import { Link, useParams } from "@tanstack/react-router";
import { useLocale } from "../i18n/useLocale";
import { useEventDetail } from "../hooks/useEventDetail";
import { ContentLoader } from "../components/shared/ContentLoader";
import { EventDetailBody } from "../components/events/EventDetailBody";
import { ArrowLeftIcon } from "../icons/ArrowLeftIcon";

export function EventDetailRoute() {
  const { id } = useParams({ strict: false });
  const { t } = useLocale();
  const { event, loading } = useEventDetail(id);

  if (loading || !event) {
    return <ContentLoader />;
  }

  return (
    <>
      <Link to="/events" className="mb-4 inline-flex items-center gap-1 text-xs font-medium text-muted no-underline hover:text-primary">
        <ArrowLeftIcon className="h-3.5 w-3.5" />
        {t("events.allEvents")}
      </Link>

      <div className="animate-fade-up">
        <EventDetailBody event={event} />
        <div className="pb-4" />
      </div>
    </>
  );
}
