import { Link } from "@tanstack/react-router";
import { useLocale } from "../i18n/useLocale";
import { EventForm } from "../components/events/EventForm";
import { ArrowLeftIcon } from "../icons/ArrowLeftIcon";

export function AddEventRoute() {
  const { t } = useLocale();

  return (
    <div className="py-4">
      <Link to="/events" className="mb-4 inline-flex items-center gap-1 text-xs font-medium text-muted no-underline hover:text-primary">
        <ArrowLeftIcon className="h-3.5 w-3.5" />{t("common.back")}
      </Link>
      <h1 className="font-family-display text-2xl font-medium tracking-tight text-primary">{t("events.addEvent")}</h1>
      <p className="mt-1 mb-6 text-sm text-muted">{t("events.fillDetails")}</p>
      <EventForm />
    </div>
  );
}
