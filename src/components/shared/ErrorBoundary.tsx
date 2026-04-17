import { Component, useEffect } from "react";
import type { ReactNode } from "react";

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return <ErrorFallback onReset={() => this.setState({ hasError: false })} />;
  }
}

function ErrorFallback({ onReset }: { onReset: () => void }) {
  useEffect(function dismissAppLoader() {
    const loader = document.getElementById("app-loader");
    if (!loader) return;
    loader.style.opacity = "0";
    setTimeout(() => loader.remove(), 200);
  }, []);

  const isIt = document.documentElement.lang === "it";

  const title = isIt ? "Ops, qualcosa è caduto" : "Oops, a little spill";
  const description = isIt
    ? "Un piccolo imprevisto in sala. Ricarica la pagina o torna alla home."
    : "A small mishap in the dining room. Reload the page or head back home.";
  const reloadLabel = isIt ? "Ricarica" : "Reload";
  const backLabel = isIt ? "Torna alla home" : "Back to home";

  function handleReload() {
    onReset();
    window.location.reload();
  }

  function handleBack() {
    onReset();
    window.location.href = "/";
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <img src="/spilled-drink-light.svg" alt="" width={160} height={96} className="mb-6 dark:hidden" />
      <img src="/spilled-drink-dark.svg" alt="" width={160} height={96} className="mb-6 hidden dark:block" />
      <h1 className="font-family-display text-2xl font-medium tracking-tight text-primary">
        {title}
      </h1>
      <p className="mt-2 max-w-sm text-sm text-muted">
        {description}
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={handleReload}
          className="rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover active:scale-95"
        >
          {reloadLabel}
        </button>
        <button
          type="button"
          onClick={handleBack}
          className="rounded-xl border border-border px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-surface-warm active:scale-95"
        >
          {backLabel}
        </button>
      </div>
    </div>
  );
}
