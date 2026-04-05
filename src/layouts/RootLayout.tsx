import { SwipeBarProvider, useSwipeBarContext } from "@luciodale/swipe-bar";
import { Outlet, useRouterState } from "@tanstack/react-router";
import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "sonner";
import { BottomNav } from "../components/BottomNav";
import { DetailBottomSheet, LinkedDetailBottomSheet } from "../components/shared/DetailBottomSheet";
import { NotificationPrompt } from "../components/shared/NotificationPrompt";
import { PwaInstallPrompt } from "../components/shared/PwaInstallPrompt";
import { useThemeColor } from "../hooks/useThemeColor";

const FormBottomSheet = lazy(() => import("../components/shared/FormBottomSheet").then((m) => ({ default: m.FormBottomSheet })));

function MainContent() {
  const { isBottomOpen } = useSwipeBarContext();

  return (
    <main
      id="main-content"
      className={`h-full overflow-x-hidden scroll-hide overscroll-y-none ${isBottomOpen ? "overflow-y-hidden" : "overflow-y-auto"}`}
    >
      <div className="mx-auto h-full flex-flex-col max-w-lg px-5 layout-bottom-padding pt-safe">
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
        offset={{ top: "max(32px, calc(env(safe-area-inset-top) + 14px))" }}
        mobileOffset={{ top: "max(32px, calc(env(safe-area-inset-top) + 14px))" }}
        toastOptions={{
          style: {
            fontFamily: "var(--font-family)",
            fontSize: "13px",
            borderRadius: "12px",
            background: "var(--color-card)",
            color: "var(--color-primary)",
            border: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-card)",
            minHeight: "48px",
          },
          actionButtonStyle: {
            background: "var(--color-danger)",
            color: "white",
            fontSize: "12px",
            fontWeight: 600,
            padding: "6px 14px",
            borderRadius: "10px",
            height: "auto",
          },
          cancelButtonStyle: {
            background: "var(--color-surface-alt)",
            color: "var(--color-muted)",
            fontSize: "12px",
            fontWeight: 500,
            padding: "6px 14px",
            borderRadius: "10px",
            border: "1px solid var(--color-border)",
            height: "auto",
          },
          classNames: {
            success: "toast-success",
            error: "toast-error",
          },
        }}
      />
      <MainContent />
      <BottomNav />
      <PwaInstallPrompt />
      {pathname === "/" && <NotificationPrompt />}
      <DetailBottomSheet />
      <LinkedDetailBottomSheet />
      <Suspense>
        <FormBottomSheet />
      </Suspense>
    </SwipeBarProvider>
  );
}
