import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useLocale } from "../i18n/useLocale";
import type { OpeningHours, ItalianDay } from "../types/database";
import {
  createRestaurantFormSchema,
  type RestaurantFormValues,
  type DayFormValues,
} from "../schemas/restaurant";
import { getOrderedDays } from "../utils/time";
import { buildRestaurantPayload } from "../utils/formData";

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

export type RestaurantFormInitialData = {
  name: string;
  description: string | null;
  types: Array<string>;
  cuisines: Array<string>;
  priceRange: number;
  phone: string | null;
  address: string;
  latitude: number | null;
  longitude: number | null;
  menuUrl: string | null;
  parsedHours: OpeningHours;
};

export function useRestaurantForm(initial?: RestaurantFormInitialData, onSuccess?: () => void) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { locale, t } = useLocale();
  const resolver = useMemo(() => zodResolver(createRestaurantFormSchema(t)), [locale]);

  const form = useForm<RestaurantFormValues>({
    resolver,
    defaultValues: {
      name: initial?.name ?? "",
      description: initial?.description ?? "",
      type: initial?.types.join(", ") ?? "",
      cuisines: initial?.cuisines ?? [],
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

  function toggleCuisine(cuisine: string) {
    const current = form.getValues("cuisines");
    const next = current.includes(cuisine)
      ? current.filter((c) => c !== cuisine)
      : [...current, cuisine];
    form.setValue("cuisines", next, { shouldDirty: true });
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

    // Defensive: the form refine should already prevent this, but if onSubmit
    // is ever invoked outside the resolver path, fail locally with a clear
    // message instead of letting the API reject `null` lat/lng with a 400.
    if (data.latitude == null || data.longitude == null) {
      setErrorMessage(t("validation.selectMapPosition"));
      setSubmitState("error");
      return;
    }

    const payload = buildRestaurantPayload(data);

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
        toast.success(t(isEdit ? "restaurants.updated" : "restaurants.submitted"));
        queryClient.invalidateQueries({ queryKey: ["my-restaurants"] });
        queryClient.invalidateQueries({ queryKey: ["admin-restaurants"] });
        queryClient.invalidateQueries({ queryKey: ["home"] });
        if (isEdit) {
          queryClient.invalidateQueries({ queryKey: ["restaurant", String(restaurantId)] });
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
    toggleCuisine,
    copyFromPrevious,
    onSubmit,
    submitState,
    errorMessage,
    t,
  };
}
