import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type ApiErrorBody = { error: string; code?: string };

async function throwIfError(res: Response) {
  if (res.ok) return;
  let body: ApiErrorBody | undefined;
  try { body = await res.json() as ApiErrorBody; } catch { /* ignore */ }
  if (body?.code === "LIMIT_REACHED") {
    throw new Error("LIMIT_REACHED");
  }
  throw new Error(body?.error ?? "Request failed");
}

export function usePromotionMutations(restaurantId: string) {
  const queryClient = useQueryClient();

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["promotions", restaurantId] });
  }

  const createMutation = useMutation({
    mutationFn: async (body: Record<string, unknown>) => {
      const res = await fetch(`/api/my-restaurants/${restaurantId}/promotions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await throwIfError(res);
    },
    onSuccess: () => {
      toast.success("Pubblicato!");
      invalidate();
    },
    onError: (err: Error) => {
      if (err.message === "LIMIT_REACHED") {
        toast.error("Limite raggiunto: massimo 3 pubblicazioni attive");
      } else {
        toast.error("Errore durante il salvataggio");
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/my-restaurants/${restaurantId}/promotions/${id}`, {
        method: "DELETE",
      });
      await throwIfError(res);
    },
    onSuccess: () => {
      toast.success("Eliminato");
      invalidate();
    },
    onError: () => {
      toast.error("Errore durante l'eliminazione");
    },
  });

  const renewMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/my-restaurants/${restaurantId}/promotions/${id}`, {
        method: "PUT",
      });
      await throwIfError(res);
    },
    onSuccess: () => {
      toast.success("Rinnovato!");
      invalidate();
    },
    onError: (err: Error) => {
      if (err.message === "LIMIT_REACHED") {
        toast.error("Limite raggiunto: massimo 3 pubblicazioni attive");
      } else {
        toast.error("Errore durante il rinnovo");
      }
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
