import { Component } from "react";
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
  const isIt = document.documentElement.lang === "it";

  const title = isIt ? "Qualcosa non ha funzionato" : "Something went wrong";
  const description = isIt
    ? "Si è verificato un errore imprevisto. Riprova."
    : "An unexpected error occurred. Please try again.";
  const buttonLabel = isIt ? "Torna alla home" : "Back to home";

  function handleClick() {
    onReset();
    window.location.href = "/";
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 text-6xl" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-muted">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 15s1.5-2 4-2 4 2 4 2" />
          <line x1="9" y1="9" x2="9.01" y2="9" />
          <line x1="15" y1="9" x2="15.01" y2="9" />
        </svg>
      </div>
      <h1 className="font-family-display text-2xl font-medium tracking-tight text-primary">
        {title}
      </h1>
      <p className="mt-2 max-w-xs text-sm text-muted">
        {description}
      </p>
      <button
        type="button"
        onClick={handleClick}
        className="mt-8 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover active:scale-95"
      >
        {buttonLabel}
      </button>
    </div>
  );
}
