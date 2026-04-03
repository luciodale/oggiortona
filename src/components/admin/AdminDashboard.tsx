import { useState, useMemo } from "react";
import { useAdminRestaurants } from "../../hooks/useAdminRestaurants";
import { useAdminEvents } from "../../hooks/useAdminEvents";
import { useRefresh } from "../../hooks/useRefresh";
import { filterBySearch } from "../../utils/adminFilter";
import { RefreshIcon } from "../../icons/RefreshIcon";
import { AdminBroadcast } from "./AdminBroadcast";
import { AdminEventList } from "./AdminEventList";
import { AdminPushToggle } from "./AdminPushToggle";
import { AdminReviewFilter, type ReviewFilter } from "./AdminReviewFilter";
import { AdminRestaurantList } from "./AdminRestaurantList";
import { AdminSearch } from "./AdminSearch";
import { AdminTabs } from "./AdminTabs";

export type AdminTab = "restaurants" | "events";

export function AdminDashboard() {
  const [tab, setTab] = useState<AdminTab>("restaurants");
  const [search, setSearch] = useState("");
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>("pending");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showBroadcast, setShowBroadcast] = useState(false);

  const { restaurants, loading: loadingRestaurants, toggleRestaurant, deletePromotion } = useAdminRestaurants();
  const { events, loading: loadingEvents, toggleEvent, deleteEvent } = useAdminEvents();
  const { isRefreshing, handleRefresh } = useRefresh([["admin-restaurants"], ["admin-events"]]);

  const filteredRestaurants = useMemo(
    () => filterBySearch(restaurants, search, (r) => r.name).filter(
      (r) => reviewFilter === "pending" ? r.approved === 0 : r.approved === 1,
    ),
    [restaurants, search, reviewFilter],
  );

  const filteredEvents = useMemo(
    () => filterBySearch(events, search, (e) => e.title).filter((e) => {
      if (reviewFilter === "ai_scraper") return e.ownerId === "ai_scraper" && e.approved === 0;
      if (reviewFilter === "pending") return e.ownerId !== "ai_scraper" && e.approved === 0;
      return e.approved === 1;
    }),
    [events, search, reviewFilter],
  );

  const loading = loadingRestaurants || loadingEvents;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-family-display text-2xl font-medium tracking-tight text-primary">
          Pannello Admin
        </h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Aggiorna"
            onClick={handleRefresh}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border-light bg-surface text-muted transition-all duration-300 hover:border-accent/40 hover:text-accent active:scale-90"
          >
            <RefreshIcon className={`h-[18px] w-[18px]${isRefreshing ? " animate-spin" : ""}`} />
          </button>
          <AdminPushToggle />
        </div>
      </div>

      <div className="mt-5">
        <button
          type="button"
          onClick={() => setShowBroadcast((v) => !v)}
          className="text-[12px] font-semibold text-accent transition-colors hover:text-accent/80"
        >
          {showBroadcast ? "Nascondi broadcast" : "Notifica broadcast"}
        </button>
        {showBroadcast && (
          <div className="mt-3">
            <AdminBroadcast />
          </div>
        )}
      </div>

      <div className="mt-5 space-y-4">
        <AdminTabs tab={tab} onTabChange={setTab} />
        <AdminReviewFilter value={reviewFilter} onChange={setReviewFilter} showAiScraper={tab === "events"} />
        <AdminSearch value={search} onChange={setSearch} />
      </div>

      <div className="mt-5">
        {tab === "restaurants" ? (
          <AdminRestaurantList
            restaurants={filteredRestaurants}
            loading={loading}
            expandedId={expandedId}
            onExpand={setExpandedId}
            onToggle={toggleRestaurant}
            onDeletePromotion={deletePromotion}
          />
        ) : (
          <AdminEventList
            events={filteredEvents}
            loading={loading}
            onToggle={toggleEvent}
            onDelete={deleteEvent}
          />
        )}
      </div>
    </div>
  );
}
