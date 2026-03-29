import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

export function useThemeColor() {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    let themeColor = "#fdfaf6";
    let bodyClass = "bg-surface";

    if (pathname.startsWith("/restaurants")) {
      themeColor = "#fdf2ed";
      bodyClass = "page-mangiare";
    } else if (pathname.startsWith("/events") || pathname.startsWith("/add/event")) {
      themeColor = "#edf4f8";
      bodyClass = "page-fare";
    } else if (pathname.startsWith("/sign-in")) {
      themeColor = "#fdf2ed";
      bodyClass = "page-mangiare";
    }

    if (meta) meta.setAttribute("content", themeColor);
    document.body.className = `min-h-screen min-h-dvh ${bodyClass}`;
  }, [pathname]);
}
