import { Link, useParams } from "@tanstack/react-router";
import { useEventDetail } from "../../hooks/useEventDetail";
import { useLocale } from "../../i18n/useLocale";
import { ArrowLeftIcon } from "../../icons/ArrowLeftIcon";
import { EventForm } from "../events/EventForm";

export function ProfileEventEdit() {
  const { id } = useParams({ strict: false });
  const { event, loading } = useEventDetail(id);
  const { t } = useLocale();

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

  const initialData = {
    title: event.title,
    description: event.description,
    category: event.category,
    dateStart: event.dateStart,
    dateEnd: event.dateEnd,
    timeStart: event.timeStart,
    timeEnd: event.timeEnd,
    address: event.address,
    phone: event.phone,
    latitude: event.latitude,
    longitude: event.longitude,
    price: event.price,
    link: event.link,
  };

  return (
    <div>
      <Link
        to="/profile"
        className="mb-4 inline-flex items-center gap-1 text-xs font-medium text-muted no-underline hover:text-primary"
      >
        <ArrowLeftIcon className="h-3.5 w-3.5" />
        {t("profile.backToProfile")}
      </Link>

      <h1 className="font-family-display text-2xl font-medium tracking-tight text-primary">
        {t("profile.editEventTitle")}
      </h1>

      <div className="mt-6">
        <EventForm eventId={event.id} initialData={initialData} />
      </div>
    </div>
  );
}
