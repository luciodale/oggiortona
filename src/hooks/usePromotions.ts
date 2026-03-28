import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import type { PromotionRow } from "../types/database";

type PromotionTab = "special" | "deal" | "news";

type PromotionsData = {
  items: Array<PromotionRow>;
};

type PromotionsResponse = PromotionsData & {
  restaurantName: string;
};

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

export function usePromotions(restaurantId: string) {
  const [tab, setTab] = useState<PromotionTab>("special");
  const [data, setData] = useState<PromotionsData>({ items: [] });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [restaurantName, setRestaurantName] = useState("");
  const [specialForm, setSpecialForm] = useState<SpecialFormState>(INITIAL_SPECIAL);
  const [dealForm, setDealForm] = useState<DealFormState>(INITIAL_DEAL);
  const [newsForm, setNewsForm] = useState<NewsFormState>(INITIAL_NEWS);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/my-restaurants/${restaurantId}/promotions`);
      if (!res.ok) return;
      const json: PromotionsResponse = await res.json();
      setData({ items: json.items });
      setRestaurantName(json.restaurantName);
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleCreate() {
    let body: Record<string, unknown>;

    switch (tab) {
      case "special": {
        if (!specialForm.description.trim()) {
          toast.error("La descrizione è obbligatoria");
          return;
        }
        body = {
          type: "special",
          description: specialForm.description.trim(),
          durationDays: Number(specialForm.durationDays),
          ...(specialForm.price ? { price: Number(specialForm.price) } : {}),
          ...(specialForm.hasTime ? { timeStart: specialForm.timeStart, timeEnd: specialForm.timeEnd } : {}),
        };
        break;
      }
      case "deal": {
        if (!dealForm.title.trim()) {
          toast.error("Il titolo è obbligatorio");
          return;
        }
        body = {
          type: "deal",
          title: dealForm.title.trim(),
          durationDays: Number(dealForm.durationDays),
          ...(dealForm.description.trim() ? { description: dealForm.description.trim() } : {}),
          ...(dealForm.price ? { price: Number(dealForm.price) } : {}),
          ...(dealForm.hasTime ? { timeStart: dealForm.timeStart, timeEnd: dealForm.timeEnd } : {}),
        };
        break;
      }
      case "news": {
        if (!newsForm.title.trim()) {
          toast.error("Il titolo è obbligatorio");
          return;
        }
        body = {
          type: "news",
          title: newsForm.title.trim(),
          ...(newsForm.description.trim() ? { description: newsForm.description.trim() } : {}),
          ...(newsForm.price ? { price: Number(newsForm.price) } : {}),
          durationDays: Number(newsForm.durationDays),
          ...(newsForm.hasTime ? { timeStart: newsForm.timeStart, timeEnd: newsForm.timeEnd } : {}),
        };
        break;
      }
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/my-restaurants/${restaurantId}/promotions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        toast.error("Errore durante il salvataggio");
        return;
      }

      toast.success("Pubblicato!");

      switch (tab) {
        case "special": setSpecialForm(INITIAL_SPECIAL); break;
        case "deal": setDealForm(INITIAL_DEAL); break;
        case "news": setNewsForm(INITIAL_NEWS); break;
      }

      await fetchData();
    } finally {
      setSubmitting(false);
    }
  }

  function handleDelete(id: number) {
    toast("Vuoi davvero eliminare questo elemento?", {
      duration: Infinity,
      action: {
        label: "Elimina",
        onClick: () => executeDelete(id),
      },
      cancel: {
        label: "Annulla",
        onClick: () => {},
      },
    });
  }

  async function executeDelete(id: number) {
    const res = await fetch(
      `/api/my-restaurants/${restaurantId}/promotions/${id}`,
      { method: "DELETE" },
    );
    if (res.ok) {
      toast.success("Eliminato");
      await fetchData();
    } else {
      toast.error("Errore durante l'eliminazione");
    }
  }

  async function handleRenew(id: number) {
    const res = await fetch(
      `/api/my-restaurants/${restaurantId}/promotions/${id}`,
      { method: "PUT" },
    );
    if (res.ok) {
      toast.success("Rinnovato!");
      await fetchData();
    } else {
      toast.error("Errore durante il rinnovo");
    }
  }

  return {
    tab,
    setTab,
    data,
    loading,
    submitting,
    restaurantName,
    specialForm,
    setSpecialForm,
    dealForm,
    setDealForm,
    newsForm,
    setNewsForm,
    handleCreate,
    handleDelete,
    handleRenew,
  };
}
