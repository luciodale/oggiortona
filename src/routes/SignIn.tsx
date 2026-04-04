import { Link } from "@tanstack/react-router";
import { SignInForm } from "../components/auth/SignInForm";
import { useLocale } from "../i18n/useLocale";
import { ArrowLeftIcon } from "../icons/ArrowLeftIcon";

export function SignInRoute() {
  const { t } = useLocale();

  return (
    <div className="h-full flex flex-col justify-center">
      <Link to="/" className="inline-flex items-center gap-1 py-4 text-xs font-medium text-muted no-underline hover:text-primary">
        <ArrowLeftIcon className="h-3.5 w-3.5" />{t("common.back")}
      </Link>

      <div className="flex flex-1 mt-auto flex-col justify-center">
        <div className="mb-8 text-center">
          <img src="/icon.svg" alt="Oggi a Ortona" width="56" height="56" className="mx-auto rounded-xl" />
          <h1 className="mt-4 font-family-display text-2xl font-medium tracking-tight text-primary">
            {t("auth.signIn")}
          </h1>
          <p className="mt-1.5 text-[13px] text-muted">
            {t("auth.signInDesc")}
          </p>
        </div>

        <SignInForm />
      </div>
    </div>
  );
}
