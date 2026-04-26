import { createRouter, createRoute, createRootRoute, Outlet, RouterProvider, lazyRouteComponent } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useHydrateAtoms } from "jotai/utils";
import { localeAtom } from "./i18n/useLocale";
import { authAtom } from "./hooks/useSpaAuth";
import { ErrorBoundary } from "./components/shared/ErrorBoundary";
import { RootLayout } from "./layouts/RootLayout";
import { importWithReload } from "./utils/importWithReload";
import type { Locale } from "./types/domain";

function lazyWithReload<T extends Record<string, unknown>>(loader: () => Promise<T>, exportName: string) {
  return lazyRouteComponent(() => importWithReload(loader), exportName);
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Route tree
const rootRoute = createRootRoute({ component: RootLayout });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: lazyWithReload(() => import("./routes/Home"), "HomeRoute"),
});
const restaurantsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/restaurants",
  component: lazyWithReload(() => import("./routes/Restaurants"), "RestaurantsRoute"),
});
const eventsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/events",
  component: lazyWithReload(() => import("./routes/Events"), "EventsRoute"),
});
const storesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/stores",
  component: lazyWithReload(() => import("./routes/Stores"), "StoresRoute"),
});
const signInRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sign-in",
  component: lazyWithReload(() => import("./routes/SignIn"), "SignInRoute"),
});
const ssoCallbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sign-in/sso-callback",
  component: lazyWithReload(() => import("./routes/SSOCallback"), "SSOCallbackRoute"),
});

function SectionLayout() {
  return <div className="pt-safe pb-4"><Outlet /></div>;
}

// Profile routes
const profileRoute = createRoute({ getParentRoute: () => rootRoute, path: "/profile", component: SectionLayout });
const profileIndexRoute = createRoute({
  getParentRoute: () => profileRoute,
  path: "/",
  component: lazyWithReload(() => import("./components/profile/ProfileDashboard"), "ProfileDashboard"),
});

// Admin routes
const adminRoute = createRoute({ getParentRoute: () => rootRoute, path: "/admin", component: SectionLayout });
const adminIndexRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/",
  component: lazyWithReload(() => import("./components/admin/AdminDashboard"), "AdminDashboard"),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  restaurantsRoute,
  eventsRoute,
  storesRoute,
  signInRoute,
  ssoCallbackRoute,
  profileRoute.addChildren([profileIndexRoute]),
  adminRoute.addChildren([adminIndexRoute]),
]);

function RethrowToBoundary({ error }: { error: Error }) {
  throw error;
}

const router = createRouter({
  routeTree,
  defaultErrorComponent: RethrowToBoundary,
});

type SpaAppProps = {
  locale: Locale;
  user: { id: string; name: string | null; email: string | null; avatarUrl: string | null } | null;
  isAdmin: boolean;
};

function DevErrorThrow(): never {
  throw new Error("Dev preview: forced render error");
}

export function SpaApp({ locale, user, isAdmin }: SpaAppProps) {
  useHydrateAtoms([
    [localeAtom, locale],
    [authAtom, { user, isAdmin }],
  ]);

  const isDevErrorPreview =
    import.meta.env.DEV &&
    typeof window !== "undefined" &&
    window.location.pathname === "/dev/error";

  return (
    <ErrorBoundary>
      {isDevErrorPreview ? (
        <DevErrorThrow />
      ) : (
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      )}
    </ErrorBoundary>
  );
}
