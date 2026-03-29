import { useState } from "react";

type PromotionTab = "special" | "deal" | "news";

export type SpecialFormState = {
  description: string;
  price: string;
  durationDays: string;
  hasTime: boolean;
  timeStart: string;
  timeEnd: string;
};

export type DealFormState = {
  title: string;
  description: string;
  price: string;
  durationDays: string;
  hasTime: boolean;
  timeStart: string;
  timeEnd: string;
};

export type NewsFormState = {
  title: string;
  description: string;
  price: string;
  durationDays: string;
  hasTime: boolean;
  timeStart: string;
  timeEnd: string;
};

const INITIAL_SPECIAL: SpecialFormState = {
  description: "",
  price: "",
  durationDays: "1",
  hasTime: false,
  timeStart: "12:00",
  timeEnd: "15:00",
};

const INITIAL_DEAL: DealFormState = {
  title: "",
  description: "",
  price: "",
  durationDays: "1",
  hasTime: false,
  timeStart: "18:00",
  timeEnd: "22:00",
};

const INITIAL_NEWS: NewsFormState = {
  title: "",
  description: "",
  price: "",
  durationDays: "1",
  hasTime: false,
  timeStart: "10:00",
  timeEnd: "18:00",
};

export function usePromotionForms() {
  const [tab, setTab] = useState<PromotionTab>("special");
  const [errorMessage, setErrorMessage] = useState("");
  const [specialForm, setSpecialForm] = useState<SpecialFormState>(INITIAL_SPECIAL);
  const [dealForm, setDealForm] = useState<DealFormState>(INITIAL_DEAL);
  const [newsForm, setNewsForm] = useState<NewsFormState>(INITIAL_NEWS);

  function buildCreateBody(): Record<string, unknown> | null {
    setErrorMessage("");

    switch (tab) {
      case "special": {
        if (!specialForm.description.trim()) {
          setErrorMessage("La descrizione è obbligatoria");
          return null;
        }
        return {
          type: "special",
          description: specialForm.description.trim(),
          durationDays: Number(specialForm.durationDays),
          ...(specialForm.price ? { price: Number(specialForm.price) } : {}),
          ...(specialForm.hasTime ? { timeStart: specialForm.timeStart, timeEnd: specialForm.timeEnd } : {}),
        };
      }
      case "deal": {
        if (!dealForm.title.trim()) {
          setErrorMessage("Il titolo è obbligatorio");
          return null;
        }
        return {
          type: "deal",
          title: dealForm.title.trim(),
          durationDays: Number(dealForm.durationDays),
          ...(dealForm.description.trim() ? { description: dealForm.description.trim() } : {}),
          ...(dealForm.price ? { price: Number(dealForm.price) } : {}),
          ...(dealForm.hasTime ? { timeStart: dealForm.timeStart, timeEnd: dealForm.timeEnd } : {}),
        };
      }
      case "news": {
        if (!newsForm.title.trim()) {
          setErrorMessage("Il titolo è obbligatorio");
          return null;
        }
        return {
          type: "news",
          title: newsForm.title.trim(),
          ...(newsForm.description.trim() ? { description: newsForm.description.trim() } : {}),
          ...(newsForm.price ? { price: Number(newsForm.price) } : {}),
          durationDays: Number(newsForm.durationDays),
          ...(newsForm.hasTime ? { timeStart: newsForm.timeStart, timeEnd: newsForm.timeEnd } : {}),
        };
      }
    }
  }

  function resetCurrentForm() {
    switch (tab) {
      case "special": setSpecialForm(INITIAL_SPECIAL); break;
      case "deal": setDealForm(INITIAL_DEAL); break;
      case "news": setNewsForm(INITIAL_NEWS); break;
    }
  }

  return {
    tab,
    setTab,
    errorMessage,
    specialForm,
    setSpecialForm,
    dealForm,
    setDealForm,
    newsForm,
    setNewsForm,
    buildCreateBody,
    resetCurrentForm,
  };
}
