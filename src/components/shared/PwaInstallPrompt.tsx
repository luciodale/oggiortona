import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { usePwaInstallPrompt } from "../../hooks/usePwaInstallPrompt";
import { ShareIcon } from "../../icons/ShareIcon";
import { SquarePlusIcon } from "../../icons/SquarePlusIcon";
import { useLocale } from "../../i18n/useLocale";

export function PwaInstallPrompt() {
  const { t } = useLocale();
  const { canInstall, showIos, handleInstall, handleDismiss } =
    usePwaInstallPrompt();

  const androidShown = useRef(false);
  const iosShown = useRef(false);

  useEffect(() => {
    if (!canInstall || androidShown.current) return;
    androidShown.current = true;

    toast.custom(
      (id) => (
        <div className="w-full rounded-2xl bg-white p-4 shadow-lg ring-1 ring-border/50">
          <div className="flex items-center gap-3">
            <img
              src="/icon-192.png"
              alt=""
              aria-hidden="true"
              className="h-12 w-12 shrink-0 rounded-xl shadow-sm"
            />
            <div className="min-w-0 flex-1">
              <p className="font-family-display text-[15px] font-semibold text-primary">
                {t("pwa.title")}
              </p>
              <p className="mt-0.5 text-[12px] leading-snug text-muted">
                {t("pwa.subtitle")}
              </p>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => {
                handleDismiss();
                toast.dismiss(id);
              }}
              className="flex-1 rounded-xl bg-surface-alt px-3 py-2.5 text-[12px] font-medium text-muted transition-colors hover:text-primary"
            >
              {t("pwa.notNow")}
            </button>
            <button
              type="button"
              onClick={() => {
                handleInstall();
                toast.dismiss(id);
              }}
              className="flex-1 rounded-xl bg-accent px-3 py-2.5 text-[12px] font-semibold text-white transition-colors hover:bg-accent-hover"
            >
              {t("pwa.installBtn")}
            </button>
          </div>
        </div>
      ),
      { duration: Infinity },
    );
  }, [canInstall, handleInstall, handleDismiss, t]);

  useEffect(() => {
    if (!showIos || iosShown.current) return;
    iosShown.current = true;

    toast.custom(
      (id) => (
        <div className="w-full rounded-2xl bg-white p-4 shadow-lg ring-1 ring-border/50">
          <div className="flex items-center gap-3">
            <img
              src="/icon-192.png"
              alt=""
              aria-hidden="true"
              className="h-12 w-12 shrink-0 rounded-xl shadow-sm"
            />
            <div className="min-w-0 flex-1">
              <p className="font-family-display text-[15px] font-semibold text-primary">
                {t("pwa.title")}
              </p>
              <p className="mt-0.5 text-[12px] leading-snug text-muted">
                {t("pwa.subtitle")}
              </p>
            </div>
          </div>
          <div className="mt-3 space-y-2.5 rounded-xl bg-surface-warm px-3 py-3">
            <div className="flex items-center gap-2 text-[12px] text-primary">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white shadow-sm">
                <ShareIcon className="h-3.5 w-3.5 text-accent" />
              </span>
              <span>{t("pwa.iosStep1")} <span className="text-muted">{t("pwa.iosStep1detail")}</span></span>
            </div>
            <div className="flex items-center gap-2 text-[12px] text-primary">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white shadow-sm">
                <SquarePlusIcon className="h-3.5 w-3.5 text-accent" />
              </span>
              <span>{t("pwa.iosStep2")}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              handleDismiss();
              toast.dismiss(id);
            }}
            className="mt-3 w-full rounded-xl bg-surface-alt px-3 py-2.5 text-[12px] font-medium text-muted transition-colors hover:text-primary"
          >
            {t("pwa.gotIt")}
          </button>
        </div>
      ),
      { duration: Infinity },
    );
  }, [showIos, handleDismiss, t]);

  return null;
}
