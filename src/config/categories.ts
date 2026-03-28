export const restaurantTypeLabels: Record<string, string> = {
  ristorante: "Ristorante",
  pizzeria: "Pizzeria",
  trattoria: "Trattoria",
  bar: "Bar",
  gelateria: "Gelateria",
  pasticceria: "Pasticceria",
  pescheria: "Pescheria",
  altro: "Altro",
};

export const eventCategoryLabels: Record<string, string> = {
  sagra: "Sagra",
  musica: "Musica",
  mercato: "Mercato",
  cultura: "Cultura",
  sport: "Sport",
  altro: "Altro",
};

export const eventCategoryColors: Record<string, string> = {
  sagra: "bg-amber-50 text-amber-700",
  musica: "bg-violet-50 text-violet-700",
  mercato: "bg-emerald-50 text-emerald-700",
  cultura: "bg-sky-50 text-sky-700",
  sport: "bg-rose-50 text-rose-700",
  altro: "bg-stone-100 text-stone-600",
};

export const restaurantTypes = [
  "ristorante",
  "pizzeria",
  "trattoria",
  "bar",
  "gelateria",
  "pasticceria",
  "pescheria",
  "altro",
];

export const restaurantFormTypes = [
  "ristorante",
  "bar",
  "gelateria",
] as const;

export const eventFormCategories = [
  "sport",
  "cultura",
  "musica",
] as const;

export const eventFilterCategories = [
  "sport",
  "musica",
  "cultura",
  "altro",
];

export const eventCategories = [
  "sport",
  "musica",
  "cultura",
  "altro",
];
