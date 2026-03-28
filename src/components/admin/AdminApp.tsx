import { RouterProvider } from "@tanstack/react-router";
import { adminRouter } from "../../config/adminRoutes";

export default function AdminApp() {
  return <RouterProvider router={adminRouter} />;
}
