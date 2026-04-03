import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { OpeningHours, DaySchedule, ItalianDay } from "../types/database";
import {
  restaurantFormSchema,
  FORM_TYPES,
  type RestaurantFormValues,
  type DayFormValues,
} from "../schemas/restaurant";
import { getOrderedDays } from "../utils/time";

type SubmitState = "idle" | "submitting" | "error";

function emptyDayState(): DayFormValues {
  return {
    closed: true,
    open: "09:00",
    close: "22:00",
    hasSecondShift: false,
    open2: "19:00",
    close2: "23:00",
  };
}

function buildInitialHours(): Record<ItalianDay, DayFormValues> {
  const days = getOrderedDays();
  const result = {} as Record<ItalianDay, DayFormValues>;
  for (const day of days) {
    result[day] = emptyDayState();
  }
  return result;
}

function hoursToOpeningHours(
  hours: Record<string, DayFormValues>,
): OpeningHours {
  const result = {} as Record<string, DaySchedule | null>;
  for (const [day, state] of Object.entries(hours)) {
    if (state.closed) {
      result[day] = null;
    } else {
      result[day] = {
        open: state.open,
        close: state.close,
        open2: state.hasSecondShift ? state.open2 : null,
        close2: state.hasSecondShift ? state.close2 : null,
      };
    }
  }
  return result as OpeningHours;
}

function openingHoursToForm(
  oh: OpeningHours,
): Record<ItalianDay, DayFormValues> {
  const result = {} as Record<ItalianDay, DayFormValues>;
  for (const day of getOrderedDays()) {
    const schedule = oh[day];
    if (!schedule) {
      result[day] = emptyDayState();
    } else {
      result[day] = {
        closed: false,
        open: schedule.open,
        close: schedule.close,
        hasSecondShift: schedule.open2 != null,
        open2: schedule.open2 ?? "19:00",
        close2: schedule.close2 ?? "23:00",
      };
    }
  }
  return result;
}

type InitialData = {
  name: string;
  description: string | null;
  types: Array<string>;
  priceRange: number;
  phone: string | null;
  address: string;
  latitude: number | null;
  longitude: number | null;
  menuUrl: string | null;
  parsedHours: OpeningHours;
};

function splitTypes(types: Array<string>) {
  const formTypeStrings = FORM_TYPES as readonly string[];
  const fixed = types.filter((t) => formTypeStrings.includes(t));
  const custom = types.filter((t) => !formTypeStrings.includes(t));
  return { fixed, customType: custom.join(", ") };
}

export function useRestaurantForm(initial?: InitialData) {
  const initialSplit = initial ? splitTypes(initial.types) : null;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<RestaurantFormValues>({
    resolver: zodResolver(restaurantFormSchema),
    defaultValues: {
      name: initial?.name ?? "",
      description: initial?.description ?? "",
      types: initialSplit?.fixed ?? [],
      customType: initialSplit?.customType ?? "",
      priceRange: initial?.priceRange ?? 2,
      phone: initial?.phone ?? "",
      address: initial?.address ?? "",
      latitude: initial?.latitude ?? null,
      longitude: initial?.longitude ?? null,
      menuUrl: initial?.menuUrl ?? "",
      hours: initial?.parsedHours
        ? openingHoursToForm(initial.parsedHours)
        : buildInitialHours(),
    },
    mode: "onBlur",
  });

  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function toggleType(t: string) {
    const current = form.getValues("types");
    const has = current.includes(t);
    const next = has ? current.filter((x) => x !== t) : [...current, t];
    form.setValue("types", next, { shouldValidate: true });
  }

  function copyFromPrevious(day: ItalianDay) {
    const days = getOrderedDays();
    const idx = days.indexOf(day);
    if (idx <= 0) return;
    const prevDay = days[idx - 1]!;
    const prevValues = form.getValues(`hours.${prevDay}`);
    form.setValue(`hours.${day}`, { ...prevValues }, { shouldDirty: true });
  }

  async function onSubmit(
    data: RestaurantFormValues,
    restaurantId?: number,
  ) {
    setSubmitState("submitting");
    setErrorMessage("");

    const allTypes = [
      ...data.types,
      ...data.customType
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean),
    ];

    const payload = {
      name: data.name,
      description: data.description || undefined,
      type: allTypes.join(","),
      price_range: data.priceRange,
      phone: data.phone || undefined,
      address: data.address,
      latitude: data.latitude ?? undefined,
      longitude: data.longitude ?? undefined,
      opening_hours: JSON.stringify(hoursToOpeningHours(data.hours)),
      menu_url: data.menuUrl || undefined,
    };

    const isEdit = restaurantId != null;

    try {
      const res = await fetch(
        isEdit ? `/api/restaurants/${restaurantId}` : "/api/restaurants",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (res.ok) {
        toast.success(isEdit ? "Locale aggiornato!" : "Locale inviato per approvazione!");
        queryClient.invalidateQueries({ queryKey: ["my-restaurants"] });
        queryClient.invalidateQueries({ queryKey: ["home"] });
        if (isEdit) {
          queryClient.invalidateQueries({ queryKey: ["restaurant", String(restaurantId)] });
        }
        navigate({ to: "/profile" });
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
    toggleType,
    copyFromPrevious,
    onSubmit,
    submitState,
    errorMessage,
  };
}
