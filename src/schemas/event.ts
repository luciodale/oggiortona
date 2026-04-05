import { z } from "zod";
import type { TFn } from "../i18n/t";

export const FORM_CATEGORIES = ["sport", "cibo", "cultura", "altro"] as const;

const apiTimeString = z.string().regex(/^\d{2}:\d{2}$/);
const apiDateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export function createEventFormSchema(t: TFn) {
  const timeString = z.string().regex(/^\d{2}:\d{2}$/, t("validation.invalidTime"));
  const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, t("validation.invalidDate"));

  return z
    .object({
      title: z.string().trim().min(1, t("validation.titleRequired")).max(150, t("validation.maxChars", { max: 150 })),
      description: z.string().max(500, t("validation.maxChars", { max: 500 })),
      categories: z.array(z.string()),
      customCategory: z.string(),
      dateStart: dateString,
      dateEnd: z.union([dateString, z.literal("")]),
      timeStart: z.union([timeString, z.literal("")]),
      timeEnd: z.union([timeString, z.literal("")]),
      address: z.string().trim().min(1, t("validation.locationRequired")),
      phone: z.union([z.string().trim(), z.literal("")]),
      latitude: z.number().nullable(),
      longitude: z.number().nullable(),
      price: z.union([z.number().min(0, t("validation.invalidPrice")), z.nan()]).nullable(),
      link: z.string().trim(),
      restaurantId: z.number().nullable(),
    })
    .refine(
      (data) => data.categories.length > 0 || data.customCategory.trim().length > 0,
      {
        message: t("validation.selectCategory"),
        path: ["categories"],
      },
    )
    .refine((data) => data.latitude != null && data.longitude != null, {
      message: t("validation.selectMapPosition"),
      path: ["latitude"],
    });
}

export type EventFormValues = z.infer<ReturnType<typeof createEventFormSchema>>;

export const createEventApiSchema = z.object({
  title: z.string().trim().min(1, "Titolo obbligatorio").max(150),
  description: z.string().trim().max(500).nullish(),
  category: z.string().trim().min(1, "Categoria obbligatoria"),
  date_start: apiDateString,
  date_end: z.union([apiDateString, z.literal("")]).nullish(),
  time_start: z.union([apiTimeString, z.literal("")]).nullish(),
  time_end: z.union([apiTimeString, z.literal("")]).nullish(),
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
