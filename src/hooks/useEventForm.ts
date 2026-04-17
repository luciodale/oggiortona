import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useLocale } from "../i18n/useLocale";
import {
  createEventFormSchema,
  FORM_CATEGORIES,
  type EventFormValues,
} from "../schemas/event";
import { getTodayISO } from "../utils/date";
import { buildEventPayload } from "../utils/formData";

type SubmitState = "idle" | "submitting" | "error";

export type EventFormInitialData = {
  title: string;
  description: string | null;
  category: string;
  dateStart: string;
  dateEnd: string | null;
  timeStart: string | null;
  timeEnd: string | null;
  address: string;
  phone: string | null;
  latitude: number | null;
  longitude: number | null;
  price: number | null;
  link: string | null;
  restaurantId: number | null;
  storeId: number | null;
};

function splitCategories(category: string) {
  const all = category.split(",").map((c) => c.trim()).filter(Boolean);
  const formCatStrings = FORM_CATEGORIES as readonly string[];
  const fixed = all.filter((c) => formCatStrings.includes(c));
  const custom = all.filter((c) => !formCatStrings.includes(c));
  return { fixed, customCategory: custom.join(", ") };
}

export function useEventForm(initial?: EventFormInitialData, onSuccess?: () => void) {
  const initialSplit = initial ? splitCategories(initial.category) : null;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { locale, t } = useLocale();
  const resolver = useMemo(() => zodResolver(createEventFormSchema(t)), [locale]);

  const form = useForm<EventFormValues>({
    resolver,
    defaultValues: {
      title: initial?.title ?? "",
      description: initial?.description ?? "",
      categories: initialSplit?.fixed ?? [],
      customCategory: initialSplit?.customCategory ?? "",
      dateStart: initial?.dateStart ?? getTodayISO(),
      dateEnd: initial?.dateEnd ?? "",
      timeStart: initial?.timeStart ?? "",
      timeEnd: initial?.timeEnd ?? "",
      address: initial?.address ?? "",
      phone: initial?.phone ?? "",
      latitude: initial?.latitude ?? null,
      longitude: initial?.longitude ?? null,
      price: initial?.price ?? null,
      link: initial?.link ?? "",
      restaurantId: initial?.restaurantId ?? null,
      storeId: initial?.storeId ?? null,
    },
    mode: "onBlur",
  });

  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function toggleCategory(cat: string) {
    const current = form.getValues("categories");
    const has = current.includes(cat);
    const next = has ? current.filter((c) => c !== cat) : [...current, cat];
    form.setValue("categories", next, { shouldValidate: true });
  }

  async function onSubmit(data: EventFormValues, eventId?: number) {
    setSubmitState("submitting");
    setErrorMessage("");

    // Defensive: the form refine should already prevent this, but if onSubmit
    // is ever invoked outside the resolver path, fail locally with a clear
    // message instead of letting the API reject `null` lat/lng with a 400.
    if (data.latitude == null || data.longitude == null) {
      setErrorMessage(t("validation.selectMapPosition"));
      setSubmitState("error");
      return;
    }

    const payload = buildEventPayload(data);

    const isEdit = eventId != null;

    try {
      const res = await fetch(
        isEdit ? `/api/events/${eventId}` : "/api/events",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (res.ok) {
        toast.success(t(isEdit ? "events.updated" : "events.published"));
        queryClient.invalidateQueries({ queryKey: ["home"] });
        queryClient.invalidateQueries({ queryKey: ["my-events"] });
        queryClient.invalidateQueries({ queryKey: ["admin-events"] });
        if (isEdit) {
          queryClient.invalidateQueries({ queryKey: ["event", String(eventId)] });
        }
        if (onSuccess) {
          onSuccess();
        } else {
          navigate({ to: "/profile" });
        }
      } else {
        const resData = (await res.json()) as { error: string };
        setErrorMessage(resData.error);
        setSubmitState("error");
      }
    } catch {
      setErrorMessage(t("validation.connectionError"));
      setSubmitState("error");
    }
  }

  return {
    form,
    toggleCategory,
    onSubmit,
    submitState,
    errorMessage,
    t,
  };
}
