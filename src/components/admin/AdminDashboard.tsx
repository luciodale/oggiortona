import { useAdminData } from "../../hooks/useAdminData";
import { AdminEventList } from "./AdminEventList";
import { AdminPushToggle } from "./AdminPushToggle";
import { AdminRestaurantList } from "./AdminRestaurantList";
import { AdminSearch } from "./AdminSearch";
import { AdminTabs } from "./AdminTabs";

export function AdminDashboard() {
  const {
    tab,
    setTab,
    search,
    setSearch,
    filteredRestaurants,
    filteredEvents,
    loading,
    toggleRestaurant,
    toggleEvent,
    deletePromotion,
    expandedId,
    setExpandedId,
  } = useAdminData();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-family-display text-2xl font-medium tracking-tight text-primary">
          Pannello Admin
        </h1>
        <AdminPushToggle />
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
