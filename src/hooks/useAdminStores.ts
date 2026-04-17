import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { StorePromotionRow, StoreRow } from "../types/database";

type AdminStore = StoreRow & {
  ownerEmail: string | null;
  ownerName: string | null;
  promotions: Array<StorePromotionRow>;
};

type ToggleVars = { id: number; wasActive: boolean };

export function useAdminStores() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<{ stores: Array<AdminStore> }>({
    queryKey: ["admin-stores"],
    queryFn: () => fetch("/api/admin/stores").then((r) => r.json()),
  });

  const stores = data?.stores ?? [];

  const toggleMutation = useMutation({
    mutationFn: ({ id }: ToggleVars) =>
      fetch(`/api/admin/stores/${id}`, { method: "PUT" }).then((res) => {
        if (!res.ok) throw new Error();
      }),
    onSuccess: (_data, { wasActive }) => {
      queryClient.invalidateQueries({ queryKey: ["admin-stores"] });
      toast.success(wasActive ? "Negozio disabilitato" : "Negozio approvato");
    },
    onError: () => {
      toast.error("Errore durante l'aggiornamento");
    },
  });

  function toggleStore(id: number) {
    const wasActive = stores.find((s) => s.id === id)?.active === 1;
    toggleMutation.mutate({ id, wasActive });
  }

  return { stores, loading: isLoading, toggleStore };
}
