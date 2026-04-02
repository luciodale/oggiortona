import { SwipeBarProvider, useSwipeBarContext } from "@luciodale/swipe-bar";
import { Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { Toaster } from "sonner";
import { BottomNav } from "../components/BottomNav";
import { DetailBottomSheet } from "../components/shared/DetailBottomSheet";
import { NotificationPrompt } from "../components/shared/NotificationPrompt";
import { PwaInstallPrompt } from "../components/shared/PwaInstallPrompt";
import { useThemeColor } from "../hooks/useThemeColor";

function MainContent() {
  const { isBottomOpen } = useSwipeBarContext();

  return (
    <main
      id="main-content"
      className={`h-full overflow-x-hidden scroll-hide overscroll-y-none ${isBottomOpen ? "overflow-y-hidden" : "overflow-y-auto"}`}
    >
      <div className="mx-auto max-w-lg px-5 pb-24 pt-safe">
        <Outlet />
      </div>
    </main>
  );
}

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

  useEffect(function scrollToTop() {
    document.getElementById("main-content")?.scrollTo(0, 0);
  }, [pathname]);

  return (
    <SwipeBarProvider>
      <Toaster
        position="top-center"
        className="toaster-offset"
        toastOptions={{
          style: {
            fontFamily: "var(--font-family)",
            fontSize: "13px",
            borderRadius: "12px",
          },
        }}
      />
      <MainContent />
      <BottomNav />
      <PwaInstallPrompt />
      {pathname === "/" && <NotificationPrompt />}
      <DetailBottomSheet />
    </SwipeBarProvider>
  );
}
