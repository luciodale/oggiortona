import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function usePromotionMutations(restaurantId: string) {
  const queryClient = useQueryClient();

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["promotions", restaurantId] });
  }

  const createMutation = useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      fetch(`/api/my-restaurants/${restaurantId}/promotions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then((res) => {
        if (!res.ok) throw new Error("Save failed");
      }),
    onSuccess: () => {
      toast.success("Pubblicato!");
      invalidate();
    },
    onError: () => {
      toast.error("Errore durante il salvataggio");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      fetch(`/api/my-restaurants/${restaurantId}/promotions/${id}`, {
        method: "DELETE",
      }).then((res) => {
        if (!res.ok) throw new Error("Delete failed");
      }),
    onSuccess: () => {
      toast.success("Eliminato");
      invalidate();
    },
    onError: () => {
      toast.error("Errore durante l'eliminazione");
    },
  });

  const renewMutation = useMutation({
    mutationFn: (id: number) =>
      fetch(`/api/my-restaurants/${restaurantId}/promotions/${id}`, {
        method: "PUT",
      }).then((res) => {
        if (!res.ok) throw new Error("Renew failed");
      }),
    onSuccess: () => {
      toast.success("Rinnovato!");
      invalidate();
    },
    onError: () => {
      toast.error("Errore durante il rinnovo");
    },
  });

  function createPromotion(body: Record<string, unknown>, opts?: { onSuccess?: () => void }) {
    createMutation.mutate(body, { onSuccess: opts?.onSuccess });
  }

  function deletePromotion(id: number) {
    toast("Vuoi davvero eliminare questo elemento?", {
      duration: Infinity,
      action: {
        label: "Elimina",
        onClick: () => deleteMutation.mutate(id),
      },
      cancel: {
        label: "Annulla",
        onClick: () => {},
      },
    });
  }

  function renewPromotion(id: number) {
    renewMutation.mutate(id);
  }

  return {
    createPromotion,
    deletePromotion,
    renewPromotion,
    submitting: createMutation.isPending,
  };
}
