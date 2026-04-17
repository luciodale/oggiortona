import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useLocale } from "../i18n/useLocale";
import { formatRemainingMs } from "../utils/cooldownFormat";

type ApiErrorBody = {
  error: string;
  code?: string;
  remainingMs?: number | null;
  nextSlotAt?: string | null;
};

type CooldownErrorCause = { code: "COOLDOWN_ACTIVE"; remainingMs: number | null };

function makeCooldownError(remainingMs: number | null): Error {
  const err = new Error("COOLDOWN_ACTIVE");
  (err as Error & { cause: CooldownErrorCause }).cause = { code: "COOLDOWN_ACTIVE", remainingMs };
  return err;
}

function getCooldownCause(err: unknown): CooldownErrorCause | null {
  if (!(err instanceof Error)) return null;
  const cause = (err as Error & { cause?: unknown }).cause;
  if (typeof cause !== "object" || cause === null) return null;
  const c = cause as Record<string, unknown>;
  if (c.code !== "COOLDOWN_ACTIVE") return null;
  const remainingMs = typeof c.remainingMs === "number" ? c.remainingMs : null;
  return { code: "COOLDOWN_ACTIVE", remainingMs };
}

async function throwIfError(res: Response) {
  if (res.ok) return;
  let body: ApiErrorBody | undefined;
  try { body = await res.json() as ApiErrorBody; } catch { /* ignore */ }
  if (body?.code === "COOLDOWN_ACTIVE") {
    throw makeCooldownError(body.remainingMs ?? null);
  }
  throw new Error(body?.error ?? "Request failed");
}

export function useStorePromotionMutations(storeId: string) {
  const queryClient = useQueryClient();
  const { t } = useLocale();

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["store-promotions", storeId] });
  }

  function toastError(err: Error, fallback: string) {
    const cause = getCooldownCause(err);
    if (cause) {
      toast.error(t("validation.cooldownActive", { time: formatRemainingMs(cause.remainingMs) }));
      return;
    }
    toast.error(fallback);
  }

  const createMutation = useMutation({
    mutationFn: async (body: Record<string, unknown>) => {
      const res = await fetch(`/api/my-stores/${storeId}/promotions`, {
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
    onError: (err: Error) => toastError(err, "Errore durante il salvataggio"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/my-stores/${storeId}/promotions/${id}`, {
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
      const res = await fetch(`/api/my-stores/${storeId}/promotions/${id}`, {
        method: "PUT",
      });
      await throwIfError(res);
    },
    onSuccess: () => {
      toast.success("Rinnovato!");
      invalidate();
    },
    onError: (err: Error) => toastError(err, "Errore durante il rinnovo"),
  });

  const editMutation = useMutation({
    mutationFn: async ({ id, body }: { id: number; body: Record<string, unknown> }) => {
      const res = await fetch(`/api/my-stores/${storeId}/promotions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await throwIfError(res);
    },
    onSuccess: () => {
      toast.success(t("storefront.editSaved"));
      invalidate();
    },
    onError: () => {
      toast.error("Errore durante il salvataggio");
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

  function editPromotion(id: number, body: Record<string, unknown>, opts?: { onSuccess?: () => void }) {
    editMutation.mutate({ id, body }, { onSuccess: opts?.onSuccess });
  }

  return {
    createPromotion,
    deletePromotion,
    renewPromotion,
    editPromotion,
    submitting: createMutation.isPending,
    editing: editMutation.isPending,
  };
}
