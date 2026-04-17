import { useState } from "react";
import { useLocale } from "../i18n/useLocale";
import type { StorePromotionRow } from "../types/database";
import { durationFromRange } from "../utils/promotions";

export type StorePromotionType = "generale" | "saldi" | "deal" | "news";

export type StorePromotionFormState = {
  type: StorePromotionType;
  title: string;
  price: string;
  durationDays: string;
  timeStart: string;
  timeEnd: string;
};

const INITIAL: StorePromotionFormState = {
  type: "generale",
  title: "",
  price: "",
  durationDays: "1",
  timeStart: "",
  timeEnd: "",
};

function isStorePromotionType(value: string): value is StorePromotionType {
  return value === "generale" || value === "saldi" || value === "deal" || value === "news";
}

export function storePromotionToFormState(promotion: StorePromotionRow): StorePromotionFormState {
  const duration = durationFromRange(promotion.dateStart, promotion.dateEnd);
  return {
    type: isStorePromotionType(promotion.type) ? promotion.type : "generale",
    title: promotion.title,
    price: promotion.price != null ? String(promotion.price) : "",
    durationDays: String(duration),
    timeStart: promotion.timeStart ?? "",
    timeEnd: promotion.timeEnd ?? "",
  };
}

export function useStorePromotionForm(initial?: StorePromotionFormState) {
  const { t } = useLocale();
  const [form, setForm] = useState<StorePromotionFormState>(initial ?? INITIAL);
  const [errorMessage, setErrorMessage] = useState("");
  const [titleError, setTitleError] = useState("");

  function setType(type: StorePromotionType) {
    setForm((prev) => ({ ...prev, type }));
  }

  function validateTitle(title: string) {
    const trimmed = title.trim();
    if (!trimmed) {
      setTitleError(t("validation.titleRequired"));
      return false;
    }
    if (trimmed.length > 150) {
      setTitleError(t("validation.titleTooLong", { max: 150 }));
      return false;
    }
    setTitleError("");
    return true;
  }

  function buildBody(): Record<string, unknown> | null {
    setErrorMessage("");

    if (!validateTitle(form.title)) return null;

    return {
      type: form.type,
      title: form.title.trim(),
      durationDays: Number(form.durationDays),
      ...(form.price ? { price: Number(form.price) } : {}),
      ...(form.timeStart ? { timeStart: form.timeStart } : {}),
      ...(form.timeEnd ? { timeEnd: form.timeEnd } : {}),
    };
  }

  function resetForm() {
    setForm(initial ?? INITIAL);
    setErrorMessage("");
    setTitleError("");
  }

  return {
    form,
    setForm,
    setType,
    errorMessage,
    titleError,
    validateTitle,
    buildCreateBody: buildBody,
    buildEditBody: buildBody,
    resetForm,
  };
}
