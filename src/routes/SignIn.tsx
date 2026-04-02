import { Link } from "@tanstack/react-router";
import { useLocale } from "../i18n/useLocale";
import { SignInForm } from "../components/auth/SignInForm";
import { ArrowLeftIcon } from "../icons/ArrowLeftIcon";

export function SignInRoute() {
  const { t } = useLocale();

  return (
    <div className="flex min-h-[calc(100dvh-6rem)] flex-col justify-center">
      <Link to="/" className="mb-4 inline-flex items-center gap-1 text-xs font-medium text-muted no-underline hover:text-primary">
        <ArrowLeftIcon className="h-3.5 w-3.5" />{t("common.back")}
      </Link>
      <SignInForm />
    </div>
  );
}
