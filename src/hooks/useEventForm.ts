import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  eventFormSchema,
  FORM_CATEGORIES,
  type EventFormValues,
} from "../schemas/event";
import { getTodayISO } from "../utils/date";

type SubmitState = "idle" | "submitting" | "success" | "error";

type InitialData = {
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
};

function splitCategories(category: string) {
  const all = category.split(",").map((c) => c.trim()).filter(Boolean);
  const formCatStrings = FORM_CATEGORIES as readonly string[];
  const fixed = all.filter((c) => formCatStrings.includes(c));
  const custom = all.filter((c) => !formCatStrings.includes(c));
  return { fixed, customCategory: custom.join(", ") };
}

export function useEventForm(initial?: InitialData) {
  const initialSplit = initial ? splitCategories(initial.category) : null;

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
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
    },
    mode: "onBlur",
  });

  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [createdId, setCreatedId] = useState<number | null>(null);

  function toggleCategory(cat: string) {
    const current = form.getValues("categories");
    const has = current.includes(cat);
    const next = has ? current.filter((c) => c !== cat) : [...current, cat];
    form.setValue("categories", next, { shouldValidate: true });
  }

  async function onSubmit(data: EventFormValues, eventId?: number) {
    setSubmitState("submitting");
    setErrorMessage("");

    const allCategories = [
      ...data.categories,
      ...data.customCategory
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean),
    ];

    const payload = {
      title: data.title,
      description: data.description || undefined,
      category: allCategories.join(","),
      date_start: data.dateStart,
      date_end: data.dateEnd || undefined,
      time_start: data.timeStart || undefined,
      time_end: data.timeEnd || undefined,
      address: data.address,
      phone: data.phone || undefined,
      latitude: data.latitude ?? undefined,
      longitude: data.longitude ?? undefined,
      price: data.price != null && !Number.isNaN(data.price) ? data.price : undefined,
      link: data.link || undefined,
    };

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
        const resData = (await res.json()) as { event: { id: number } };
        setCreatedId(resData.event.id);
        setSubmitState("success");
      } else {
        const resData = (await res.json()) as { error: string };
        setErrorMessage(resData.error);
        setSubmitState("error");
      }
    } catch {
      setErrorMessage("Errore di connessione");
      setSubmitState("error");
    }
  }

  return {
    form,
    toggleCategory,
    onSubmit,
    submitState,
    errorMessage,
    createdId,
  };
}
