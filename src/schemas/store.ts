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

export function createStoreFormSchema(t: TFn) {
  const dayFormSchema = createDayFormSchema(t);

  return z
    .object({
      name: z.string().trim().min(1, t("validation.nameRequired")).max(100, t("validation.maxChars", { max: 100 })),
      description: z.string().max(300, t("validation.maxChars", { max: 300 })),
      type: z.string().trim().min(1, t("validation.typeRequired")),
      phone: z.string(),
      address: z.string().trim().min(1, t("validation.addressRequired")),
      latitude: z.number().nullable(),
      longitude: z.number().nullable(),
      storeUrl: z.string(),
      hours: z.record(z.string(), dayFormSchema),
    })
    .refine((data) => data.latitude != null && data.longitude != null, {
      message: t("validation.selectMapPosition"),
      path: ["latitude"],
    });
}

export type StoreFormValues = z.infer<ReturnType<typeof createStoreFormSchema>>;

export const createStoreApiSchema = z.object({
  name: z.string().trim().min(1, "Nome obbligatorio").max(100),
  description: z.string().trim().max(300).nullish(),
  type: z.string().trim().min(1, "Tipo obbligatorio"),
  phone: z.string().nullish(),
  address: z.string().trim().min(1, "Indirizzo obbligatorio"),
  opening_hours: z.string().min(1, "Orari obbligatori"),
  store_url: z.string().nullish(),
  latitude: z.number(),
  longitude: z.number(),
});

export type CreateStoreApiPayload = z.infer<typeof createStoreApiSchema>;

export const updateStoreApiSchema = createStoreApiSchema
  .partial()
  .required({ latitude: true, longitude: true });

export type UpdateStoreApiPayload = z.infer<typeof updateStoreApiSchema>;
