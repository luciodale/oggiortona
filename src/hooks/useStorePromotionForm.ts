import { useState } from "react";
import { useLocale } from "../i18n/useLocale";
import type { StorePromotionRow } from "../types/database";

export type StorePromotionType = "generale" | "saldi" | "deal" | "news";

export type StorePromotionFormState = {
  type: StorePromotionType;
  title: string;
  price: string;
  timeStart: string;
  timeEnd: string;
};

const INITIAL: StorePromotionFormState = {
  type: "generale",
  title: "",
  price: "",
  timeStart: "",
  timeEnd: "",
};

function isStorePromotionType(value: string): value is StorePromotionType {
  return value === "generale" || value === "saldi" || value === "deal" || value === "news";
}

export function storePromotionToFormState(promotion: StorePromotionRow): StorePromotionFormState {
  return {
    type: isStorePromotionType(promotion.type) ? promotion.type : "generale",
    title: promotion.title,
    price: promotion.price != null ? String(promotion.price) : "",
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

    let price: number | undefined;
    if (form.price) {
      const parsed = Number(form.price);
      if (!Number.isFinite(parsed) || parsed < 0) {
        setErrorMessage(t("validation.invalidPrice"));
        return null;
      }
      price = parsed;
    }

    if (form.timeStart && form.timeEnd && form.timeEnd < form.timeStart) {
      setErrorMessage(t("validation.timeEndBeforeStart"));
      return null;
    }

    return {
      type: form.type,
      title: form.title.trim(),
      ...(price !== undefined ? { price } : {}),
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
