import { useMutation } from "@tanstack/react-query";
import { useLocale } from "../i18n/useLocale";

type EntityType = "restaurant" | "event";

const ENTITY_CONFIG: Record<EntityType, { endpoint: string; confirmKey: "profile.confirmDeleteVenue" | "profile.confirmDeleteEvent" }> = {
  restaurant: { endpoint: "/api/restaurants", confirmKey: "profile.confirmDeleteVenue" },
  event: { endpoint: "/api/events", confirmKey: "profile.confirmDeleteEvent" },
};

export function useDeleteEntity(entityType: EntityType) {
  const { t } = useLocale();
  const config = ENTITY_CONFIG[entityType];

  const mutation = useMutation({
    mutationFn: (id: number) =>
      fetch(`${config.endpoint}/${id}`, { method: "DELETE" }).then((res) => {
        if (!res.ok) throw new Error("Delete failed");
      }),
    onSuccess: () => {
      window.location.reload();
    },
  });

  function handleDelete(id: number) {
    if (!window.confirm(t(config.confirmKey))) return;
    mutation.mutate(id);
  }

  return { handleDelete };
}
