import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

function resolveThemeColor(cssVar: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
}

export function useThemeColor() {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  useEffect(() => {
    function update() {
      const meta = document.querySelector('meta[name="theme-color"]');
      let cssVar = "--color-surface";
      let bodyClass = "bg-surface";

      if (pathname.startsWith("/restaurants") || pathname.startsWith("/sign-in")) {
        cssVar = "--color-mangiare-light";
        bodyClass = "page-mangiare";
      } else if (pathname.startsWith("/events")) {
        cssVar = "--color-fare-light";
        bodyClass = "page-fare";
      }

      if (meta) meta.setAttribute("content", resolveThemeColor(cssVar));
      document.body.className = `min-h-screen min-h-dvh ${bodyClass}`;
    }

    update();

    window.addEventListener("themechange", update);
    const mql = matchMedia("(prefers-color-scheme: dark)");
    mql.addEventListener("change", update);
    return () => {
      window.removeEventListener("themechange", update);
      mql.removeEventListener("change", update);
    };
  }, [pathname]);
}
