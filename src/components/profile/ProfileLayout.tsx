import { Outlet } from "@tanstack/react-router";
import { Toaster } from "sonner";

export function ProfileLayout() {
  return (
    <>
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
      <div className="py-4">
        <Outlet />
      </div>
    </>
  );
}
