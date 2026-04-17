import { useState } from "react";
import { useLocale } from "../i18n/useLocale";
import type { PromotionRow } from "../types/database";

export type PromotionType = "generale" | "special" | "deal" | "news";

export type PromotionFormState = {
  type: PromotionType;
  title: string;
  price: string;
  timeStart: string;
  timeEnd: string;
};

const INITIAL: PromotionFormState = {
  type: "generale",
  title: "",
  price: "",
  timeStart: "",
  timeEnd: "",
};

function isPromotionType(value: string): value is PromotionType {
  return value === "generale" || value === "special" || value === "deal" || value === "news";
}

export function promotionToFormState(promotion: PromotionRow): PromotionFormState {
  return {
    type: isPromotionType(promotion.type) ? promotion.type : "generale",
    title: promotion.title,
    price: promotion.price != null ? String(promotion.price) : "",
    timeStart: promotion.timeStart ?? "",
    timeEnd: promotion.timeEnd ?? "",
  };
}

export function usePromotionForm(initial?: PromotionFormState) {
  const { t } = useLocale();
  const [form, setForm] = useState<PromotionFormState>(initial ?? INITIAL);
  const [errorMessage, setErrorMessage] = useState("");
  const [titleError, setTitleError] = useState("");

  function setType(type: PromotionType) {
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
