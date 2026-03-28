import { usePwaInstallPrompt } from "../../hooks/usePwaInstallPrompt";

export function PwaInstallPrompt() {
  const { canInstall, handleInstall, handleDismiss } = usePwaInstallPrompt();

  if (!canInstall) return null;

  return (
    <div
      role="alertdialog"
      aria-label="Installa Oggi a Ortona"
      className="fixed bottom-20 left-4 right-4 z-50 animate-fade-up rounded-2xl bg-white p-4 shadow-lg ring-1 ring-border/50"
      style={{ animationDuration: "0.3s" }}
    >
      <div className="flex items-start gap-3">
        <img
          src="/icon-192.png"
          alt=""
          aria-hidden="true"
          className="h-10 w-10 shrink-0 rounded-xl"
        />
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold text-primary">
            Installa Oggi a Ortona
          </p>
          <p className="mt-0.5 text-[11px] text-muted">
            Accesso rapido dalla schermata home
          </p>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={handleDismiss}
          className="flex-1 rounded-xl bg-surface-alt px-3 py-2 text-[12px] font-medium text-muted transition-colors hover:text-primary"
        >
          Non ora
        </button>
        <button
          type="button"
          onClick={handleInstall}
          className="flex-1 rounded-xl bg-accent px-3 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-accent-hover"
        >
          Installa
        </button>
      </div>
    </div>
  );
}
