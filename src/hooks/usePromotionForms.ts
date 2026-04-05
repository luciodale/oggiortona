import { useState } from "react";
import { useLocale } from "../i18n/useLocale";

export type PromotionType = "generale" | "special" | "deal" | "news";

export type PromotionFormState = {
  type: PromotionType;
  title: string;
  price: string;
  durationDays: string;
  timeStart: string;
  timeEnd: string;
};

const INITIAL: PromotionFormState = {
  type: "generale",
  title: "",
  price: "",
  durationDays: "1",
  timeStart: "",
  timeEnd: "",
};

export function usePromotionForm() {
  const { t } = useLocale();
  const [form, setForm] = useState<PromotionFormState>(INITIAL);
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

  function buildCreateBody(): Record<string, unknown> | null {
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
    setForm(INITIAL);
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
    buildCreateBody,
    resetForm,
  };
}
