import { useOAuthSignIn } from "../../hooks/useOAuthSignIn";
import type { Locale } from "../../types/domain";
import { LocaleProvider, useLocale } from "../../i18n/useLocale";

type SignInFormProps = {
  locale: Locale;
};

export function SignInForm({ locale }: SignInFormProps) {
  return (
    <LocaleProvider locale={locale}>
      <SignInFormInner />
    </LocaleProvider>
  );
}

function SignInFormInner() {
  const { t } = useLocale();
  const { loading, error, handleOAuth, providers } = useOAuthSignIn();

  return (
    <div className="space-y-3">
      {providers.map(({ strategy, label }) => {
        const isLoading = loading === strategy;
        return (
          <button
            key={strategy}
            type="button"
            disabled={loading !== null}
            aria-busy={isLoading}
            onClick={() => handleOAuth(strategy)}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-white px-4 py-3.5 text-[13px] font-semibold text-primary transition-all hover:bg-surface-alt active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" role="status" aria-label={t("common.loading")} />
            ) : null}
            {t("auth.signInWith", { provider: label })}
          </button>
        );
      })}
      {error && <p className="text-center text-[12px] text-danger" role="alert">{error}</p>}
    </div>
  );
}
