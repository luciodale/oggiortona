import { useLocale } from "../../i18n/useLocale";
import { MapPinIcon } from "../../icons/MapPinIcon";
import { MessageIcon } from "../../icons/MessageIcon";
import { PhoneIcon } from "../../icons/PhoneIcon";
import { IconBubble } from "./IconBubble";

type CardContactButtonsProps = {
  phone: string | null;
  name: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
};

export function CardContactButtons({ phone, name, address, latitude, longitude }: CardContactButtonsProps) {
  const { t } = useLocale();

  const mapsHref =
    latitude != null && longitude != null
      ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  return (
    <div className="flex shrink-0 items-center gap-1.5">
      {phone && (
        <IconBubble
          href={`https://wa.me/${phone.replace(/[\s\-+()]/g, "")}?text=${encodeURIComponent(t("aria.whatsappMessage"))}`}
          label={t("aria.whatsappFor", { name })}
          external
        >
          <MessageIcon className="h-3.5 w-3.5" />
        </IconBubble>
      )}
      <IconBubble
        href={mapsHref}
        label={t("aria.directionsFor", { name })}
        external
      >
        <MapPinIcon className="h-3.5 w-3.5" />
      </IconBubble>
      {phone && (
        <IconBubble
          href={`tel:${phone}`}
          label={t("aria.callFor", { name })}
        >
          <PhoneIcon className="h-3.5 w-3.5" />
        </IconBubble>
      )}
    </div>
  );
}
