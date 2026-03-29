import { TagIcon } from "../../icons/TagIcon";
import { useLocale } from "../../i18n/useLocale";

type EventPriceBadgeProps = {
  price: number | null;
};

export function EventPriceBadge({ price }: EventPriceBadgeProps) {
  const { t } = useLocale();
  if (!price) return null;

  return (
    <span className="flex items-center gap-1 font-medium text-fare" aria-label={t("aria.priceLabel", { price })}>
      <TagIcon className="h-3 w-3" />
      <span aria-hidden="true">{price}&euro;</span>
    </span>
  );
}
