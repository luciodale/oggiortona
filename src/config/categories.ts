import type { EventCategory, RestaurantType } from "../types/database";

export const restaurantTypeLabels: Record<RestaurantType, string> = {
  ristorante: "Ristorante",
  pizzeria: "Pizzeria",
  trattoria: "Trattoria",
  bar: "Bar",
  gelateria: "Gelateria",
  pasticceria: "Pasticceria",
  pescheria: "Pescheria",
  altro: "Altro",
};

export const eventCategoryLabels: Record<EventCategory, string> = {
  sagra: "Sagra",
  musica: "Musica",
  mercato: "Mercato",
  cultura: "Cultura",
  sport: "Sport",
  altro: "Altro",
};

export const eventCategoryColors: Record<EventCategory, string> = {
  sagra: "bg-amber-50 text-amber-700",
  musica: "bg-violet-50 text-violet-700",
  mercato: "bg-emerald-50 text-emerald-700",
  cultura: "bg-sky-50 text-sky-700",
  sport: "bg-rose-50 text-rose-700",
  altro: "bg-stone-100 text-stone-600",
};

export const restaurantTypes: Array<RestaurantType> = [
  "ristorante",
  "pizzeria",
  "trattoria",
  "bar",
  "gelateria",
  "pasticceria",
  "pescheria",
  "altro",
];

export const eventCategories: Array<EventCategory> = [
  "sagra",
  "musica",
  "mercato",
  "cultura",
  "sport",
  "altro",
];
