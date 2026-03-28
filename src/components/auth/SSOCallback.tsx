import { AuthenticateWithRedirectCallback } from "@clerk/astro/react";

export function SSOCallback() {
  return (
    <div className="flex flex-col items-center gap-4 py-20">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-accent" />
      <p className="text-sm text-muted">Accesso in corso...</p>
      <AuthenticateWithRedirectCallback />
    </div>
  );
}
