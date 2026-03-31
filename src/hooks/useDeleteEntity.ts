import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "../i18n/useLocale";

type EntityType = "restaurant" | "event";

const ENTITY_CONFIG: Record<EntityType, { endpoint: string; confirmKey: "profile.confirmDeleteVenue" | "profile.confirmDeleteEvent"; queryKeys: Array<ReadonlyArray<string>> }> = {
  restaurant: { endpoint: "/api/restaurants", confirmKey: "profile.confirmDeleteVenue", queryKeys: [["my-restaurants"], ["home"]] },
  event: { endpoint: "/api/events", confirmKey: "profile.confirmDeleteEvent", queryKeys: [["my-events"], ["home"]] },
};

export function useDeleteEntity(entityType: EntityType, onDeleted?: () => void) {
  const { t } = useLocale();
  const config = ENTITY_CONFIG[entityType];
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: number) =>
      fetch(`${config.endpoint}/${id}`, { method: "DELETE" }).then((res) => {
        if (!res.ok) throw new Error("Delete failed");
      }),
    onSuccess: () => {
      for (const key of config.queryKeys) {
        queryClient.invalidateQueries({ queryKey: key });
      }
      onDeleted?.();
    },
  });

  function handleDelete(id: number) {
    if (!window.confirm(t(config.confirmKey))) return;
    mutation.mutate(id);
  }

  return { handleDelete };
}
