import { useState, useMemo } from "react";
import { useAdminRestaurants } from "../../hooks/useAdminRestaurants";
import { useAdminEvents } from "../../hooks/useAdminEvents";
import { filterBySearch } from "../../utils/adminFilter";
import { AdminBroadcast } from "./AdminBroadcast";
import { AdminEventList } from "./AdminEventList";
import { AdminPushToggle } from "./AdminPushToggle";
import { AdminRestaurantList } from "./AdminRestaurantList";
import { AdminSearch } from "./AdminSearch";
import { AdminTabs } from "./AdminTabs";

export type AdminTab = "restaurants" | "events";

export function AdminDashboard() {
  const [tab, setTab] = useState<AdminTab>("restaurants");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showBroadcast, setShowBroadcast] = useState(false);

  const { restaurants, loading: loadingRestaurants, toggleRestaurant, deletePromotion } = useAdminRestaurants();
  const { events, loading: loadingEvents, toggleEvent } = useAdminEvents();

  const filteredRestaurants = useMemo(
    () => filterBySearch(restaurants, search, (r) => r.name),
    [restaurants, search],
  );

  const filteredEvents = useMemo(
    () => filterBySearch(events, search, (e) => e.title),
    [events, search],
  );

  const loading = loadingRestaurants || loadingEvents;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-family-display text-2xl font-medium tracking-tight text-primary">
          Pannello Admin
        </h1>
        <AdminPushToggle />
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
          />
        )}
      </div>
    </div>
  );
}
