import { createRouter, createRoute, createRootRoute } from "@tanstack/react-router";
import { AdminLayout } from "../components/admin/AdminLayout";
import { AdminDashboard } from "../components/admin/AdminDashboard";

const rootRoute = createRootRoute({
  component: AdminLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: AdminDashboard,
});

const routeTree = rootRoute.addChildren([indexRoute]);

export const adminRouter = createRouter({
  routeTree,
  basepath: "/admin",
});
