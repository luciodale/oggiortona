import { toast } from "sonner";
import { useNotificationPrompt } from "../../hooks/useNotificationPrompt";
import { BellIcon } from "../../icons/BellIcon";
import { useLocale } from "../../i18n/useLocale";

export function NotificationPrompt() {
  const { t } = useLocale();
  const { visible, busy, handleEnable, handleDismiss } =
    useNotificationPrompt();

  function onDismiss() {
    handleDismiss();
    toast(t("push.dismissHint"), { duration: 4000 });
  }

  return (
    <>
      {visible && (
        <div
          role="alertdialog"
          aria-label={t("push.promptTitle")}
          className="fixed bottom-20 left-4 right-4 z-50 animate-fade-up rounded-2xl bg-card p-4 shadow-lg ring-1 ring-border/50"
          style={{ animationDuration: "0.3s" }}
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10">
              <BellIcon className="h-5 w-5 text-accent" strokeWidth={2} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-primary">
                {t("push.promptTitle")}
              </p>
              <p className="mt-0.5 text-[11px] text-muted">
                {t("push.promptBody")}
              </p>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={onDismiss}
              disabled={busy}
              className="flex-1 rounded-xl bg-surface-alt px-3 py-2 text-[12px] font-medium text-muted transition-colors hover:text-primary"
            >
              {t("pwa.notNow")}
            </button>
            <button
              type="button"
              onClick={handleEnable}
              disabled={busy}
              className="flex-1 rounded-xl bg-accent px-3 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-accent-hover"
            >
              {busy ? t("push.activating") : t("push.promptEnable")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
