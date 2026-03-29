import { formatDateShort } from "../../utils/date";

type DateRangeProps = {
  dateStart: string;
  dateEnd: string;
  className?: string;
};

export function DateRange({ dateStart, dateEnd, className }: DateRangeProps) {
  if (dateStart === dateEnd) return null;

  return (
    <span className={className}>
      Fino al {formatDateShort(dateEnd)}
    </span>
  );
}
