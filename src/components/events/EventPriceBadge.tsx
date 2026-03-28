import { TagIcon } from "../../icons/TagIcon";

type EventPriceBadgeProps = {
  price: number | null;
};

export function EventPriceBadge({ price }: EventPriceBadgeProps) {
  if (!price) return null;

  return (
    <span className="flex items-center gap-1 font-medium text-fare" aria-label={`Prezzo: ${price} euro`}>
      <TagIcon className="h-3 w-3" />
      <span aria-hidden="true">{price}&euro;</span>
    </span>
  );
}
