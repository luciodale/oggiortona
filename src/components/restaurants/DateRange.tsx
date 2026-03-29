import { useLocale } from "../../i18n/useLocale";
import { formatDateShort } from "../../utils/date";

type DateRangeProps = {
  dateStart: string;
  dateEnd: string;
  className?: string;
};

export function DateRange({ dateStart, dateEnd, className }: DateRangeProps) {
  const { locale, t } = useLocale();
  if (dateStart === dateEnd) return null;

  return (
    <span className={className}>
      {t("common.untilDate", { date: formatDateShort(dateEnd, locale) })}
    </span>
  );
}
