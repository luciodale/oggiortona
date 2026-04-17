import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { useSpaAuth } from "../hooks/useSpaAuth";
import { useLocale } from "../i18n/useLocale";
import { CalendarIcon } from "../icons/CalendarIcon";
import { CupIcon } from "../icons/CupIcon";
import { HomeIcon } from "../icons/HomeIcon";
import { ShieldIcon } from "../icons/ShieldIcon";
import { ShopIcon } from "../icons/ShopIcon";
import { UserIcon } from "../icons/UserIcon";

type NavItem = {
  label: string;
  to: string;
  section: string;
  Icon: typeof CupIcon;
};

function getActiveColor(section: string) {
  if (section === "locali") return "text-mangiare";
  if (section === "fare") return "text-fare";
  if (section === "stores") return "text-stores";
  return "text-accent";
}

function isActive(section: string, pathname: string) {
  if (section === "home") return pathname === "/";
  if (section === "profilo")
    return pathname.startsWith("/profile") || pathname.startsWith("/add") || pathname.startsWith("/sign-in");
  if (section === "admin") return pathname.startsWith("/admin");
  if (section === "locali") return pathname.startsWith("/restaurants");
  if (section === "fare") return pathname.startsWith("/events");
  if (section === "stores") return pathname.startsWith("/stores");
  return false;
}

export function BottomNav() {
  const { user, isAdmin } = useSpaAuth();
  const { t } = useLocale();
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const navRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef(0);

  const items: Array<NavItem> = [
    { label: t("nav.today"), to: "/", section: "home", Icon: HomeIcon },
    { label: t("nav.restaurants"), to: "/restaurants", section: "locali", Icon: CupIcon },
    { label: t("nav.events"), to: "/events", section: "fare", Icon: CalendarIcon },
    { label: t("nav.stores"), to: "/stores", section: "stores", Icon: ShopIcon },
    { label: user ? t("nav.profile") : t("nav.signIn"), to: user ? "/profile" : "/sign-in", section: "profilo", Icon: UserIcon },
    ...(isAdmin ? [{ label: "Admin", to: "/admin", section: "admin", Icon: ShieldIcon }] : []),
  ];

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    function onTouchStart(e: TouchEvent) {
      startYRef.current = e.touches[0]!.clientY;
    }

    function onTouchEnd(e: TouchEvent) {
      if (Math.abs(e.changedTouches[0]!.clientY - startYRef.current) > 10) return;
      const link = (e.target as HTMLElement).closest("a");
      if (link?.href) {
        e.preventDefault();
        link.click();
      }
    }

    nav.addEventListener("touchstart", onTouchStart, { passive: true });
    nav.addEventListener("touchend", onTouchEnd, { passive: false });
    return () => {
      nav.removeEventListener("touchstart", onTouchStart);
      nav.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  return (
    <div
      ref={navRef}
      data-bottom-nav
      className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-5 h-(--height-bottomnav) bottom-nav-padding-bottom"
    >
      <nav
        className="nav-glass flex w-full max-w-sm items-center justify-around px-1 py-2"
        aria-label={t("nav.mainLabel")}
      >
        {items.map((item) => {
          const active = isActive(item.section, pathname);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-0.5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.06em] no-underline transition-all ${
                active ? getActiveColor(item.section) : "text-muted/50"
              }`}
              aria-current={active ? "page" : undefined}
            >
              <item.Icon
                className="h-[20px] w-[20px]"
                strokeWidth={active ? 2.2 : 1.5}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
