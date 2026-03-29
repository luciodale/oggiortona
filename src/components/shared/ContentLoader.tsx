import { useLocale } from "../../i18n/useLocale";

type ContentLoaderProps = {
  className?: string;
};

export function ContentLoader({ className = "py-20" }: ContentLoaderProps) {
  const { t } = useLocale();

  return (
    <div className={`flex items-center justify-center ${className}`} role="status" aria-label={t("common.loading")}>
      <div className="flex gap-2">
        <span className="bounce-dot h-2.5 w-2.5 rounded-full bg-accent" />
        <span className="bounce-dot h-2.5 w-2.5 rounded-full bg-fare" />
        <span className="bounce-dot h-2.5 w-2.5 rounded-full bg-accent/60" />
      </div>
    </div>
  );
}
