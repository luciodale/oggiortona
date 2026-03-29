import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { PromotionRow, RestaurantRow } from "../types/database";

type AdminRestaurant = RestaurantRow & {
  ownerEmail: string | null;
  ownerName: string | null;
  promotions: Array<PromotionRow>;
};

type ToggleVars = { id: number; wasActive: boolean };

export function useAdminRestaurants() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<{ restaurants: Array<AdminRestaurant> }>({
    queryKey: ["admin-restaurants"],
    queryFn: () => fetch("/api/admin/restaurants").then((r) => r.json()),
  });

  const restaurants = data?.restaurants ?? [];

  const toggleMutation = useMutation({
    mutationFn: ({ id }: ToggleVars) =>
      fetch(`/api/admin/restaurants/${id}`, { method: "PUT" }).then((res) => {
        if (!res.ok) throw new Error();
      }),
    onSuccess: (_data, { wasActive }) => {
      queryClient.invalidateQueries({ queryKey: ["admin-restaurants"] });
      toast.success(wasActive ? "Locale disabilitato" : "Locale approvato");
    },
    onError: () => {
      toast.error("Errore durante l'aggiornamento");
    },
  });

  const deletePromotionMutation = useMutation({
    mutationFn: (promotionId: number) =>
      fetch(`/api/admin/promotions/${promotionId}`, { method: "DELETE" }).then((res) => {
        if (!res.ok) throw new Error();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-restaurants"] });
      toast.success("Promozione eliminata");
    },
    onError: () => {
      toast.error("Errore durante l'eliminazione");
    },
  });

  function toggleRestaurant(id: number) {
    const wasActive = restaurants.find((r) => r.id === id)?.active === 1;
    toggleMutation.mutate({ id, wasActive });
  }

  function deletePromotion(promotionId: number) {
    deletePromotionMutation.mutate(promotionId);
  }

  return { restaurants, loading: isLoading, toggleRestaurant, deletePromotion };
}
