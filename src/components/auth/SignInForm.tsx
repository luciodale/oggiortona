import { useOAuthSignIn } from "../../hooks/useOAuthSignIn";
import { useEmailCodeSignIn } from "../../hooks/useEmailCodeSignIn";
import { useLocale } from "../../i18n/useLocale";
import { CodeInput } from "./CodeInput";
import { GoogleIcon } from "../../icons/GoogleIcon";

function TermsNotice() {
  const { t } = useLocale();
  const linkText = t("auth.termsLink");
  const full = t("auth.termsNotice", { terms: `{{LINK}}` });
  const [before, after] = full.split("{{LINK}}");

  return (
    <p className="text-center text-[11px] text-muted leading-relaxed">
      {before}
      <a href="/terms" className="underline hover:text-primary transition-colors">{linkText}</a>
      {after}
    </p>
  );
}

export function SignInForm() {
  const { t } = useLocale();
  const google = useOAuthSignIn();
  const emailCode = useEmailCodeSignIn();

  if (emailCode.step === "verify") {
    return (
      <div className="space-y-5">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-primary">{t("auth.verifyTitle")}</h2>
          <p className="mt-1 text-[13px] text-muted">{t("auth.codeSentTo", { email: emailCode.email })}</p>
        </div>

        <form onSubmit={emailCode.handleVerifyCode} className="space-y-4">
          <CodeInput
            value={emailCode.code}
            onChange={emailCode.setCode}
            disabled={emailCode.loading}
          />

          {emailCode.error && (
            <p className="text-center text-[12px] text-danger" role="alert">{emailCode.error}</p>
          )}

          <button
            type="submit"
            disabled={emailCode.loading || emailCode.code.length < 6}
            className="flex w-full items-center justify-center rounded-xl bg-accent px-4 py-3.5 text-[13px] font-semibold text-white transition-all hover:bg-accent-hover active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {emailCode.loading ? t("auth.verifying") : t("auth.verify")}
          </button>
        </form>

        <button
          type="button"
          onClick={emailCode.handleBack}
          className="block mx-auto text-[12px] text-muted hover:text-primary transition-colors"
        >
          {t("auth.changeEmail")}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        disabled={google.loading}
        onClick={google.handleGoogle}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-white px-4 py-3.5 text-[13px] font-semibold text-primary transition-all hover:bg-surface-alt active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {google.loading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" role="status" aria-label={t("common.loading")} />
        ) : (
          <GoogleIcon className="h-4 w-4" />
        )}
        {t("auth.continueWithGoogle")}
      </button>

      {google.error && <p className="text-center text-[12px] text-danger" role="alert">{google.error}</p>}

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <span className="text-[11px] text-muted">{t("auth.orContinueWithEmail")}</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <form onSubmit={emailCode.handleSendCode} className="space-y-3">
        <input
          type="email"
          value={emailCode.email}
          onChange={(e) => emailCode.setEmail(e.target.value)}
          placeholder={t("auth.emailPlaceholder")}
          required
          disabled={emailCode.loading}
          className="w-full rounded-xl border border-border bg-white px-4 py-3.5 text-[13px] text-primary placeholder:text-muted/50 transition-all focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none disabled:opacity-60"
        />

        {emailCode.error && (
          <p className="text-center text-[12px] text-danger" role="alert">{emailCode.error}</p>
        )}

        <button
          type="submit"
          disabled={emailCode.loading || !emailCode.email}
          className="flex w-full items-center justify-center rounded-xl bg-accent px-4 py-3.5 text-[13px] font-semibold text-white transition-all hover:bg-accent-hover active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {emailCode.loading ? t("auth.sending") : t("auth.sendCode")}
        </button>
      </form>

      <TermsNotice />
    </div>
  );
}
