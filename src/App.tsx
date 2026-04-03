import { createRouter, createRoute, createRootRoute, Outlet, RouterProvider, lazyRouteComponent } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useHydrateAtoms } from "jotai/utils";
import { localeAtom } from "./i18n/useLocale";
import { authAtom } from "./hooks/useSpaAuth";
import { RootLayout } from "./layouts/RootLayout";
import type { Locale } from "./types/domain";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
    },
  },
});

// Route tree
const rootRoute = createRootRoute({ component: RootLayout });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: lazyRouteComponent(() => import("./routes/Home"), "HomeRoute"),
});
const restaurantsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/restaurants",
  component: lazyRouteComponent(() => import("./routes/Restaurants"), "RestaurantsRoute"),
});
const restaurantDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/restaurants/$id",
  component: lazyRouteComponent(() => import("./routes/RestaurantDetail"), "RestaurantDetailRoute"),
});
const eventsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/events",
  component: lazyRouteComponent(() => import("./routes/Events"), "EventsRoute"),
});
const eventDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/events/$id",
  component: lazyRouteComponent(() => import("./routes/EventDetail"), "EventDetailRoute"),
});
const signInRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sign-in",
  component: lazyRouteComponent(() => import("./routes/SignIn"), "SignInRoute"),
});
const ssoCallbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sign-in/sso-callback",
  component: lazyRouteComponent(() => import("./routes/SSOCallback"), "SSOCallbackRoute"),
});

function SectionLayout() {
  return <div className="py-4"><Outlet /></div>;
}

// Profile routes
const profileRoute = createRoute({ getParentRoute: () => rootRoute, path: "/profile", component: SectionLayout });
const profileIndexRoute = createRoute({
  getParentRoute: () => profileRoute,
  path: "/",
  component: lazyRouteComponent(() => import("./components/profile/ProfileDashboard"), "ProfileDashboard"),
});

// Admin routes
const adminRoute = createRoute({ getParentRoute: () => rootRoute, path: "/admin", component: SectionLayout });
const adminIndexRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/",
  component: lazyRouteComponent(() => import("./components/admin/AdminDashboard"), "AdminDashboard"),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  restaurantsRoute,
  restaurantDetailRoute,
  eventsRoute,
  eventDetailRoute,
  signInRoute,
  ssoCallbackRoute,
  profileRoute.addChildren([profileIndexRoute]),
  adminRoute.addChildren([adminIndexRoute]),
]);

const router = createRouter({ routeTree });

type SpaAppProps = {
  locale: Locale;
  user: { id: string; name: string | null; email: string | null; avatarUrl: string | null } | null;
  isAdmin: boolean;
};

export function SpaApp({ locale, user, isAdmin }: SpaAppProps) {
  useHydrateAtoms([
    [localeAtom, locale],
    [authAtom, { user, isAdmin }],
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
