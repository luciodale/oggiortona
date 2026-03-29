import { createRouter, createRoute, createRootRoute, Outlet, RouterProvider } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useHydrateAtoms } from "jotai/utils";
import { localeAtom } from "./i18n/useLocale";
import { authAtom } from "./hooks/useSpaAuth";
import { RootLayout } from "./layouts/RootLayout";
import type { Locale } from "./types/domain";

// Route components
import { HomeRoute } from "./routes/Home";
import { RestaurantsRoute } from "./routes/Restaurants";
import { RestaurantDetailRoute } from "./routes/RestaurantDetail";
import { EventsRoute } from "./routes/Events";
import { EventDetailRoute } from "./routes/EventDetail";
import { AddEventRoute } from "./routes/AddEvent";
import { SignInRoute } from "./routes/SignIn";
import { SSOCallbackRoute } from "./routes/SSOCallback";

// Profile
import { ProfileDashboard } from "./components/profile/ProfileDashboard";
import { ProfileRestaurantPreview } from "./components/profile/ProfileRestaurantPreview";
import { ProfileRestaurantEdit } from "./components/profile/ProfileRestaurantEdit";
import { ProfileAddRestaurant } from "./components/profile/ProfileAddRestaurant";
import { ProfileStorefront } from "./components/profile/ProfileStorefront";
import { ProfileEventPreview } from "./components/profile/ProfileEventPreview";
import { ProfileEventEdit } from "./components/profile/ProfileEventEdit";

// Admin
import { AdminDashboard } from "./components/admin/AdminDashboard";

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

const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: "/", component: HomeRoute });
const restaurantsRoute = createRoute({ getParentRoute: () => rootRoute, path: "/restaurants", component: RestaurantsRoute });
const restaurantDetailRoute = createRoute({ getParentRoute: () => rootRoute, path: "/restaurants/$id", component: RestaurantDetailRoute });
const eventsRoute = createRoute({ getParentRoute: () => rootRoute, path: "/events", component: EventsRoute });
const eventDetailRoute = createRoute({ getParentRoute: () => rootRoute, path: "/events/$id", component: EventDetailRoute });
const addEventRoute = createRoute({ getParentRoute: () => rootRoute, path: "/add/event", component: AddEventRoute });
const signInRoute = createRoute({ getParentRoute: () => rootRoute, path: "/sign-in", component: SignInRoute });
const ssoCallbackRoute = createRoute({ getParentRoute: () => rootRoute, path: "/sign-in/sso-callback", component: SSOCallbackRoute });

function SectionLayout() {
  return <div className="py-4"><Outlet /></div>;
}

// Profile routes
const profileRoute = createRoute({ getParentRoute: () => rootRoute, path: "/profile", component: SectionLayout });
const profileIndexRoute = createRoute({ getParentRoute: () => profileRoute, path: "/", component: ProfileDashboard });
const profileRestaurantRoute = createRoute({ getParentRoute: () => profileRoute, path: "/restaurant/$id", component: Outlet });
const profileRestaurantPreviewRoute = createRoute({ getParentRoute: () => profileRestaurantRoute, path: "/", component: ProfileRestaurantPreview });
const profileRestaurantEditRoute = createRoute({ getParentRoute: () => profileRestaurantRoute, path: "/edit", component: ProfileRestaurantEdit });
const profileStorefrontRoute = createRoute({ getParentRoute: () => profileRestaurantRoute, path: "/storefront", component: ProfileStorefront });
const profileAddRestaurantRoute = createRoute({ getParentRoute: () => profileRoute, path: "/add/restaurant", component: ProfileAddRestaurant });
const profileEventRoute = createRoute({ getParentRoute: () => profileRoute, path: "/event/$id", component: Outlet });
const profileEventPreviewRoute = createRoute({ getParentRoute: () => profileEventRoute, path: "/", component: ProfileEventPreview });
const profileEventEditRoute = createRoute({ getParentRoute: () => profileEventRoute, path: "/edit", component: ProfileEventEdit });

// Admin routes
const adminRoute = createRoute({ getParentRoute: () => rootRoute, path: "/admin", component: SectionLayout });
const adminIndexRoute = createRoute({ getParentRoute: () => adminRoute, path: "/", component: AdminDashboard });

const routeTree = rootRoute.addChildren([
  indexRoute,
  restaurantsRoute,
  restaurantDetailRoute,
  eventsRoute,
  eventDetailRoute,
  addEventRoute,
  signInRoute,
  ssoCallbackRoute,
  profileRoute.addChildren([
    profileIndexRoute,
    profileRestaurantRoute.addChildren([profileRestaurantPreviewRoute, profileRestaurantEditRoute, profileStorefrontRoute]),
    profileAddRestaurantRoute,
    profileEventRoute.addChildren([profileEventPreviewRoute, profileEventEditRoute]),
  ]),
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
