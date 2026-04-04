import { z } from "zod";

export const FORM_CATEGORIES = ["sport", "cibo", "cultura", "altro"] as const;

const timeString = z.string().regex(/^\d{2}:\d{2}$/, "Formato orario non valido");
const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato data non valido");

export const eventFormSchema = z
  .object({
    title: z.string().trim().min(1, "Titolo obbligatorio"),
    description: z.string().max(500, "Max 500 caratteri"),
    categories: z.array(z.string()),
    customCategory: z.string(),
    dateStart: dateString,
    dateEnd: z.union([dateString, z.literal("")]),
    timeStart: z.union([timeString, z.literal("")]),
    timeEnd: z.union([timeString, z.literal("")]),
    address: z.string().trim().min(1, "Luogo obbligatorio"),
    phone: z.union([z.string().trim(), z.literal("")]),
    latitude: z.number().nullable(),
    longitude: z.number().nullable(),
    price: z.union([z.number().min(0, "Prezzo non valido"), z.nan()]).nullable(),
    link: z.string().trim(),
    restaurantId: z.number().nullable(),
  })
  .refine(
    (data) => data.categories.length > 0 || data.customCategory.trim().length > 0,
    {
      message: "Seleziona almeno una categoria o inserisci una personalizzata",
      path: ["categories"],
    },
  )
  .refine((data) => data.latitude != null && data.longitude != null, {
    message: "Seleziona una posizione sulla mappa",
    path: ["latitude"],
  });

export type EventFormValues = z.infer<typeof eventFormSchema>;

export const createEventApiSchema = z.object({
  title: z.string().trim().min(1, "Titolo obbligatorio"),
  description: z.string().trim().max(500).nullish(),
  category: z.string().trim().min(1, "Categoria obbligatoria"),
  date_start: dateString,
  date_end: z.union([dateString, z.literal("")]).nullish(),
  time_start: z.union([timeString, z.literal("")]).nullish(),
  time_end: z.union([timeString, z.literal("")]).nullish(),
  address: z.string().trim().min(1, "Luogo obbligatorio"),
  phone: z.string().trim().nullish(),
  latitude: z.number(),
  longitude: z.number(),
  price: z.number().min(0).nullish(),
  link: z.string().trim().nullish(),
  restaurant_id: z.number().int().positive().nullish(),
});

export type CreateEventApiPayload = z.infer<typeof createEventApiSchema>;

export const updateEventApiSchema = createEventApiSchema
  .partial()
  .required({ latitude: true, longitude: true });

export type UpdateEventApiPayload = z.infer<typeof updateEventApiSchema>;
