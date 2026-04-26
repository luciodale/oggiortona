import { useOAuthSignIn } from "../../hooks/useOAuthSignIn";
import { useEmailCodeSignIn } from "../../hooks/useEmailCodeSignIn";
import { useLocale } from "../../i18n/useLocale";
import { Button } from "../ui/Button";
import { CodeInput } from "./CodeInput";
import { GoogleIcon } from "../../icons/GoogleIcon";

function TermsNotice() {
  const { t } = useLocale();
  const termsText = t("auth.termsLink");
  const privacyText = t("auth.privacyLink");
  const full = t("auth.termsNotice", { terms: `{{TERMS}}`, privacy: `{{PRIVACY}}` });
  const parts = full.split(/\{\{TERMS\}\}|\{\{PRIVACY\}\}/);

  return (
    <p className="text-center text-[11px] text-muted leading-relaxed">
      {parts[0]}
      <a href="/terms" className="underline hover:text-primary transition-colors">{termsText}</a>
      {parts[1]}
      <a href="/privacy" className="underline hover:text-primary transition-colors">{privacyText}</a>
      {parts[2]}
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

          <Button
            type="submit"
            fullWidth
            disabled={emailCode.loading || emailCode.code.length < 6}
          >
            {emailCode.loading ? t("auth.verifying") : t("auth.verify")}
          </Button>
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
      <Button
        variant="outline"
        fullWidth
        disabled={google.loading}
        onClick={google.handleGoogle}
        className="gap-3"
      >
        {google.loading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" role="status" aria-label={t("common.loading")} />
        ) : (
          <GoogleIcon className="h-4 w-4" />
        )}
        {t("auth.continueWithGoogle")}
      </Button>

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
          className="w-full rounded-xl border border-border bg-card px-4 py-3.5 text-[13px] text-primary placeholder:text-muted/50 transition-all focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none disabled:opacity-60"
        />

        {emailCode.error && (
          <p className="text-center text-[12px] text-danger" role="alert">{emailCode.error}</p>
        )}

        <Button
          type="submit"
          fullWidth
          disabled={emailCode.loading || !emailCode.email}
        >
          {emailCode.loading ? t("auth.sending") : t("auth.sendCode")}
        </Button>
      </form>

      <TermsNotice />
    </div>
  );
}
