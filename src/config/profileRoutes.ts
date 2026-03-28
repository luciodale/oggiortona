import { createRouter, createRoute, createRootRoute, Outlet } from "@tanstack/react-router";
import { ProfileLayout } from "../components/profile/ProfileLayout";
import { ProfileDashboard } from "../components/profile/ProfileDashboard";
import { ProfileRestaurantPreview } from "../components/profile/ProfileRestaurantPreview";
import { ProfileRestaurantEdit } from "../components/profile/ProfileRestaurantEdit";
import { ProfileAddRestaurant } from "../components/profile/ProfileAddRestaurant";
import { ProfileStorefront } from "../components/profile/ProfileStorefront";

const rootRoute = createRootRoute({
  component: ProfileLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: ProfileDashboard,
});

const restaurantRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "restaurant/$id",
  component: Outlet,
});

const restaurantPreviewRoute = createRoute({
  getParentRoute: () => restaurantRoute,
  path: "/",
  component: ProfileRestaurantPreview,
});

const restaurantEditRoute = createRoute({
  getParentRoute: () => restaurantRoute,
  path: "/edit",
  component: ProfileRestaurantEdit,
});

const restaurantStorefrontRoute = createRoute({
  getParentRoute: () => restaurantRoute,
  path: "/storefront",
  component: ProfileStorefront,
});

const addRestaurantRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "add/restaurant",
  component: ProfileAddRestaurant,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  restaurantRoute.addChildren([restaurantPreviewRoute, restaurantEditRoute, restaurantStorefrontRoute]),
  addRestaurantRoute,
]);

export const profileRouter = createRouter({
  routeTree,
  basepath: "/profile",
});
