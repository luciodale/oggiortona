import { useState } from "react";

export type PromotionType = "generale" | "special" | "deal" | "news";

export type PromotionFormState = {
  type: PromotionType;
  title: string;
  price: string;
  durationDays: string;
  hasTime: boolean;
  timeStart: string;
  timeEnd: string;
};

const INITIAL: PromotionFormState = {
  type: "generale",
  title: "",
  price: "",
  durationDays: "1",
  hasTime: false,
  timeStart: "12:00",
  timeEnd: "15:00",
};

export function usePromotionForm() {
  const [form, setForm] = useState<PromotionFormState>(INITIAL);
  const [errorMessage, setErrorMessage] = useState("");

  function setType(type: PromotionType) {
    setForm((prev) => ({ ...prev, type }));
  }

  function buildCreateBody(): Record<string, unknown> | null {
    setErrorMessage("");

    const title = form.title.trim();
    if (!title) {
      setErrorMessage("Il titolo è obbligatorio");
      return null;
    }
    if (title.length > 150) {
      setErrorMessage("Titolo troppo lungo (max 150)");
      return null;
    }

    return {
      type: form.type,
      title,
      durationDays: Number(form.durationDays),
      ...(form.price ? { price: Number(form.price) } : {}),
      ...(form.hasTime ? { timeStart: form.timeStart, timeEnd: form.timeEnd } : {}),
    };
  }

  function resetForm() {
    setForm(INITIAL);
    setErrorMessage("");
  }

  return {
    form,
    setForm,
    setType,
    errorMessage,
    buildCreateBody,
    resetForm,
  };
}
