import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useLocale } from "../i18n/useLocale";
import type { OpeningHours, ItalianDay } from "../types/database";
import {
  createStoreFormSchema,
  type StoreFormValues,
} from "../schemas/store";
import type { DayFormValues } from "../schemas/restaurant";
import { getOrderedDays } from "../utils/time";
import { buildStorePayload } from "../utils/formData";

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

export type StoreFormInitialData = {
  name: string;
  description: string | null;
  types: Array<string>;
  phone: string | null;
  address: string;
  latitude: number | null;
  longitude: number | null;
  storeUrl: string | null;
  parsedHours: OpeningHours;
};

export function useStoreForm(initial?: StoreFormInitialData, onSuccess?: () => void) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { locale, t } = useLocale();
  const resolver = useMemo(() => zodResolver(createStoreFormSchema(t)), [locale]);

  const form = useForm<StoreFormValues>({
    resolver,
    defaultValues: {
      name: initial?.name ?? "",
      description: initial?.description ?? "",
      type: initial?.types.join(", ") ?? "",
      phone: initial?.phone ?? "",
      address: initial?.address ?? "",
      latitude: initial?.latitude ?? null,
      longitude: initial?.longitude ?? null,
      storeUrl: initial?.storeUrl ?? "",
      hours: initial?.parsedHours
        ? openingHoursToForm(initial.parsedHours)
        : buildInitialHours(),
    },
    mode: "onBlur",
  });

  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function copyFrom(target: ItalianDay, source: ItalianDay) {
    if (source === target) return;
    const sourceValues = form.getValues(`hours.${source}`);
    form.setValue(`hours.${target}`, { ...sourceValues }, { shouldDirty: true });
  }

  async function onSubmit(
    data: StoreFormValues,
    storeId?: number,
  ) {
    setSubmitState("submitting");
    setErrorMessage("");

    if (data.latitude == null || data.longitude == null) {
      setErrorMessage(t("validation.selectMapPosition"));
      setSubmitState("error");
      return;
    }

    const payload = buildStorePayload(data);

    const isEdit = storeId != null;

    try {
      const res = await fetch(
        isEdit ? `/api/stores/${storeId}` : "/api/stores",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (res.ok) {
        toast.success(t(isEdit ? "stores.updated" : "stores.submitted"));
        queryClient.invalidateQueries({ queryKey: ["my-stores"] });
        queryClient.invalidateQueries({ queryKey: ["admin-stores"] });
        queryClient.invalidateQueries({ queryKey: ["home"] });
        if (isEdit) {
          queryClient.invalidateQueries({ queryKey: ["store", String(storeId)] });
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
    copyFrom,
    onSubmit,
    submitState,
    errorMessage,
    t,
  };
}
