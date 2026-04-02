import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { EventRow } from "../types/database";

type AdminEvent = EventRow & {
  ownerEmail: string | null;
  ownerName: string | null;
};

type ToggleVars = { id: number; wasActive: boolean };

export function useAdminEvents() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<{ events: Array<AdminEvent> }>({
    queryKey: ["admin-events"],
    queryFn: () => fetch("/api/admin/events").then((r) => r.json()),
  });

  const events = data?.events ?? [];

  const toggleMutation = useMutation({
    mutationFn: ({ id }: ToggleVars) =>
      fetch(`/api/admin/events/${id}`, { method: "PUT" }).then((res) => {
        if (!res.ok) throw new Error();
      }),
    onSuccess: (_data, { wasActive }) => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      toast.success(wasActive ? "Evento disabilitato" : "Evento approvato");
    },
    onError: () => {
      toast.error("Errore durante l'aggiornamento");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      fetch(`/api/admin/events/${id}`, { method: "DELETE" }).then((res) => {
        if (!res.ok) throw new Error();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      toast.success("Evento eliminato");
    },
    onError: () => {
      toast.error("Errore durante l'eliminazione");
    },
  });

  function toggleEvent(id: number) {
    const wasActive = events.find((e) => e.id === id)?.active === 1;
    toggleMutation.mutate({ id, wasActive });
  }

  function deleteEvent(id: number) {
    deleteMutation.mutate(id);
  }

  return { events, loading: isLoading, toggleEvent, deleteEvent };
}
