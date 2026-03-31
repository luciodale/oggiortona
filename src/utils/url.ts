export function parseRedirectUrl(search: string) {
  const params = new URLSearchParams(search);
  const raw = params.get("redirect_url");
  if (!raw || raw.startsWith("//") || raw.includes("://") || !raw.startsWith("/")) return "/profile";
  return raw;
}

export function getRedirectUrl() {
  if (typeof window === "undefined") return "/";
  return parseRedirectUrl(window.location.search);
}
