import { z } from "zod";
import type { TFn } from "../i18n/t";
import { isSafeUrl } from "./url";
import { isValidOpeningHoursJson } from "./openingHours";

function isUrlFieldValid(value: string | null | undefined): boolean {
  if (!value) return true;
  return isSafeUrl(value);
}

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
    })
    .refine((data) => isUrlFieldValid(data.storeUrl), {
      message: t("validation.invalidUrl"),
      path: ["storeUrl"],
    });
}

export type StoreFormValues = z.infer<ReturnType<typeof createStoreFormSchema>>;

const baseStoreApiShape = z.object({
  name: z.string().trim().min(1, "Nome obbligatorio").max(100),
  description: z.string().trim().max(300).nullish(),
  type: z.string().trim().min(1, "Tipo obbligatorio"),
  phone: z.string().nullish(),
  address: z.string().trim().min(1, "Indirizzo obbligatorio"),
  opening_hours: z.string().min(1, "Orari obbligatori").refine(isValidOpeningHoursJson, "Orari non validi"),
  store_url: z.string().nullish(),
  latitude: z.number(),
  longitude: z.number(),
});

export const createStoreApiSchema = baseStoreApiShape.refine(
  (data) => isUrlFieldValid(data.store_url),
  { message: "URL del negozio non valido", path: ["store_url"] },
);

export type CreateStoreApiPayload = z.infer<typeof createStoreApiSchema>;

export const updateStoreApiSchema = baseStoreApiShape
  .partial()
  .required({ latitude: true, longitude: true })
  .refine((data) => isUrlFieldValid(data.store_url), {
    message: "URL del negozio non valido",
    path: ["store_url"],
  });

export type UpdateStoreApiPayload = z.infer<typeof updateStoreApiSchema>;
