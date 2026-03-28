import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "sonner";
import type { PromotionRow, RestaurantRow, EventRow } from "../types/database";
import { filterBySearch } from "../utils/adminFilter";

export type AdminTab = "restaurants" | "events";

type AdminRestaurant = RestaurantRow & {
  ownerEmail: string | null;
  promotions: Array<PromotionRow>;
};

type AdminEvent = EventRow & {
  ownerEmail: string | null;
};

export function useAdminData() {
  const [tab, setTab] = useState<AdminTab>("restaurants");
  const [search, setSearch] = useState("");
  const [restaurants, setRestaurants] = useState<Array<AdminRestaurant>>([]);
  const [events, setEvents] = useState<Array<AdminEvent>>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/restaurants").then((r) => r.json() as Promise<{ restaurants: Array<AdminRestaurant> }>),
      fetch("/api/admin/events").then((r) => r.json() as Promise<{ events: Array<AdminEvent> }>),
    ])
      .then(([rData, eData]) => {
        setRestaurants(rData.restaurants);
        setEvents(eData.events);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredRestaurants = useMemo(
    () => filterBySearch(restaurants, search, (r) => r.name),
    [restaurants, search],
  );

  const filteredEvents = useMemo(
    () => filterBySearch(events, search, (e) => e.title),
    [events, search],
  );

  const toggleRestaurant = useCallback(async function toggleRestaurant(id: number) {
    const prev = restaurants.find((r) => r.id === id);
    if (!prev) return;

    setRestaurants((rs) =>
      rs.map((r) => (r.id === id ? { ...r, active: r.active === 1 ? 0 : 1 } : r)),
    );

    try {
      const res = await fetch(`/api/admin/restaurants/${id}`, { method: "PUT" });
      if (!res.ok) throw new Error();
      toast.success(prev.active === 1 ? "Locale disabilitato" : "Locale approvato");
    } catch {
      setRestaurants((rs) =>
        rs.map((r) => (r.id === id ? { ...r, active: prev.active } : r)),
      );
      toast.error("Errore durante l'aggiornamento");
    }
  }, [restaurants]);

  const toggleEvent = useCallback(async function toggleEvent(id: number) {
    const prev = events.find((e) => e.id === id);
    if (!prev) return;

    setEvents((es) =>
      es.map((e) => (e.id === id ? { ...e, active: e.active === 1 ? 0 : 1 } : e)),
    );

    try {
      const res = await fetch(`/api/admin/events/${id}`, { method: "PUT" });
      if (!res.ok) throw new Error();
      toast.success(prev.active === 1 ? "Evento disabilitato" : "Evento approvato");
    } catch {
      setEvents((es) =>
        es.map((e) => (e.id === id ? { ...e, active: prev.active } : e)),
      );
      toast.error("Errore durante l'aggiornamento");
    }
  }, [events]);

  const deletePromotion = useCallback(async function deletePromotion(promotionId: number, restaurantId: number) {
    setRestaurants((rs) =>
      rs.map((r) =>
        r.id === restaurantId
          ? { ...r, promotions: r.promotions.filter((p) => p.id !== promotionId) }
          : r,
      ),
    );

    try {
      const res = await fetch(`/api/admin/promotions/${promotionId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Promozione eliminata");
    } catch {
      toast.error("Errore durante l'eliminazione");
    }
  }, []);

  return {
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
  };
}
