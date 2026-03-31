import { SwipeBarProvider } from "@luciodale/swipe-bar";
import { Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { Toaster } from "sonner";
import { BottomNav } from "../components/BottomNav";
import { DetailBottomSheet } from "../components/shared/DetailBottomSheet";
import { NotificationPrompt } from "../components/shared/NotificationPrompt";
import { PwaInstallPrompt } from "../components/shared/PwaInstallPrompt";
import { useThemeColor } from "../hooks/useThemeColor";

export function RootLayout() {
  useThemeColor();
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  useEffect(function dismissAppLoader() {
    const loader = document.getElementById("app-loader");
    if (!loader) return;
    loader.style.opacity = "0";
    setTimeout(() => loader.remove(), 200);
  }, []);

  return (
    <SwipeBarProvider>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            fontFamily: "var(--font-family)",
            fontSize: "13px",
            borderRadius: "12px",
          },
        }}
      />
      <main id="main-content" className="mx-auto max-w-lg px-5 pb-24 pt-safe">
        <Outlet />
      </main>
      <BottomNav />
      <PwaInstallPrompt />
      {pathname === "/" && <NotificationPrompt />}
      <DetailBottomSheet />
    </SwipeBarProvider>
  );
}
