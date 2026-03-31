import { Link, useParams } from "@tanstack/react-router";
import { useEventDetail } from "../../hooks/useEventDetail";
import { useLocale } from "../../i18n/useLocale";
import { ArrowLeftIcon } from "../../icons/ArrowLeftIcon";
import { EventCard } from "../events/EventCard";
import { EventDetailBody } from "../events/EventDetailBody";

export function ProfileEventPreview() {
  const { t } = useLocale();
  const { id } = useParams({ strict: false });
  const { event, loading } = useEventDetail(id);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-accent" />
      </div>
    );
  }

  if (!event) {
    return <p className="py-12 text-center text-sm text-muted">{t("profile.eventNotFound")}</p>;
  }

  return (
    <div>
      <Link
        to="/profile"
        className="mb-4 inline-flex items-center gap-1 text-xs font-medium text-muted no-underline hover:text-primary"
      >
        <ArrowLeftIcon className="h-3.5 w-3.5" />
        {t("nav.profile")}
      </Link>


      <EventDetailBody event={event} />

      <div className="mt-10 pb-4">
        <h2 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">
          {t("profile.previewCard")}
        </h2>
        <EventCard event={event} zipperCard={false} />
      </div>
    </div>
  );
}
