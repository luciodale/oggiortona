import { z } from "zod";

export const FORM_TYPES = ["ristorante", "bar", "gelateria"] as const;

const timeString = z.string().regex(/^\d{2}:\d{2}$/, "Formato orario non valido");

const dayFormSchema = z.object({
  closed: z.boolean(),
  open: timeString,
  close: timeString,
  hasSecondShift: z.boolean(),
  open2: timeString,
  close2: timeString,
});

export type DayFormValues = z.infer<typeof dayFormSchema>;

export const restaurantFormSchema = z
  .object({
    name: z.string().trim().min(1, "Nome obbligatorio"),
    description: z.string().max(300, "Max 300 caratteri"),
    types: z.array(z.string()),
    customType: z.string(),
    priceRange: z.number().int().min(1).max(3),
    phone: z.string(),
    address: z.string().trim().min(1, "Indirizzo obbligatorio"),
    latitude: z.number().nullable(),
    longitude: z.number().nullable(),
    menuUrl: z.string(),
    hours: z.record(z.string(), dayFormSchema),
  })
  .refine(
    (data) => data.types.length > 0 || data.customType.trim().length > 0,
    {
      message: "Seleziona almeno un tipo o inserisci un tipo personalizzato",
      path: ["types"],
    },
  );

export type RestaurantFormValues = z.infer<typeof restaurantFormSchema>;

export const createRestaurantApiSchema = z.object({
  name: z.string().trim().min(1, "Nome obbligatorio"),
  description: z.string().trim().max(300).nullish(),
  type: z.string().trim().min(1, "Tipo obbligatorio"),
  price_range: z.number().int().min(1).max(3),
  phone: z.string().nullish(),
  address: z.string().trim().min(1, "Indirizzo obbligatorio"),
  opening_hours: z.string().min(1, "Orari obbligatori"),
  menu_url: z.string().nullish(),
  latitude: z.number().nullish(),
  longitude: z.number().nullish(),
  image_url: z.string().nullish(),
});

export type CreateRestaurantApiPayload = z.infer<typeof createRestaurantApiSchema>;

export const updateRestaurantApiSchema = createRestaurantApiSchema.partial();

export type UpdateRestaurantApiPayload = z.infer<typeof updateRestaurantApiSchema>;
