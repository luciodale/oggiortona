import { z } from "zod";
import type { TFn } from "../i18n/t";

function createDayFormSchema(t: TFn) {
  const timeString = z.string().regex(/^\d{2}:\d{2}$/, t("validation.invalidTime"));
  return z.object({
    closed: z.boolean(),
    open: timeString,
    close: timeString,
    hasSecondShift: z.boolean(),
    open2: timeString,
    close2: timeString,
  });
}

export type DayFormValues = z.infer<ReturnType<typeof createDayFormSchema>>;

export function createRestaurantFormSchema(t: TFn) {
  const dayFormSchema = createDayFormSchema(t);

  return z
    .object({
      name: z.string().trim().min(1, t("validation.nameRequired")).max(100, t("validation.maxChars", { max: 100 })),
      description: z.string().max(300, t("validation.maxChars", { max: 300 })),
      type: z.string().trim().min(1, t("validation.typeRequired")),
      priceRange: z.number().int().min(1).max(3),
      phone: z.string(),
      address: z.string().trim().min(1, t("validation.addressRequired")),
      latitude: z.number().nullable(),
      longitude: z.number().nullable(),
      menuUrl: z.string(),
      hours: z.record(z.string(), dayFormSchema),
    })
    .refine((data) => data.latitude != null && data.longitude != null, {
      message: t("validation.selectMapPosition"),
      path: ["latitude"],
    });
}

export type RestaurantFormValues = z.infer<ReturnType<typeof createRestaurantFormSchema>>;

export const createRestaurantApiSchema = z.object({
  name: z.string().trim().min(1, "Nome obbligatorio").max(100),
  description: z.string().trim().max(300).nullish(),
  type: z.string().trim().min(1, "Tipo obbligatorio"),
  price_range: z.number().int().min(1).max(3),
  phone: z.string().nullish(),
  address: z.string().trim().min(1, "Indirizzo obbligatorio"),
  opening_hours: z.string().min(1, "Orari obbligatori"),
  menu_url: z.string().nullish(),
  latitude: z.number(),
  longitude: z.number(),
});

export type CreateRestaurantApiPayload = z.infer<typeof createRestaurantApiSchema>;

export const updateRestaurantApiSchema = createRestaurantApiSchema
  .partial()
  .required({ latitude: true, longitude: true });

export type UpdateRestaurantApiPayload = z.infer<typeof updateRestaurantApiSchema>;
