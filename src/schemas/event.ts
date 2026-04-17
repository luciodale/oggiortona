import { z } from "zod";
import type { TFn } from "../i18n/t";
import { getTodayISO } from "../utils/date";
import { isSafeUrl } from "./url";

export const FORM_CATEGORIES = ["sport", "cibo", "cultura", "altro"] as const;

const apiTimeString = z.string().regex(/^\d{2}:\d{2}$/);
const apiDateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

function isDateEndOnOrAfterStart(start: string | null | undefined, end: string | null | undefined): boolean {
  if (!start || !end) return true;
  return end >= start;
}

function isTimeEndOnOrAfterStart(start: string | null | undefined, end: string | null | undefined): boolean {
  if (!start || !end) return true;
  return end >= start;
}

function isUrlFieldValid(value: string | null | undefined): boolean {
  if (!value) return true;
  return isSafeUrl(value);
}

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
      storeId: z.number().nullable(),
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
    })
    .refine((data) => isDateEndOnOrAfterStart(data.dateStart, data.dateEnd || null), {
      message: t("validation.dateEndBeforeStart"),
      path: ["dateEnd"],
    })
    .refine((data) => isTimeEndOnOrAfterStart(data.timeStart || null, data.timeEnd || null), {
      message: t("validation.timeEndBeforeStart"),
      path: ["timeEnd"],
    })
    .refine((data) => isUrlFieldValid(data.link), {
      message: t("validation.invalidUrl"),
      path: ["link"],
    });
}

export type EventFormValues = z.infer<ReturnType<typeof createEventFormSchema>>;

const baseEventApiShape = z.object({
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
  store_id: z.number().int().positive().nullish(),
});

export const createEventApiSchema = baseEventApiShape
  .refine((data) => data.date_start >= getTodayISO(), {
    message: "La data di inizio non può essere nel passato",
    path: ["date_start"],
  })
  .refine((data) => isDateEndOnOrAfterStart(data.date_start, data.date_end), {
    message: "La data di fine non può essere precedente a quella di inizio",
    path: ["date_end"],
  })
  .refine((data) => isTimeEndOnOrAfterStart(data.time_start, data.time_end), {
    message: "L'orario di fine non può essere precedente a quello di inizio",
    path: ["time_end"],
  })
  .refine((data) => isUrlFieldValid(data.link), {
    message: "URL non valido",
    path: ["link"],
  });

export type CreateEventApiPayload = z.infer<typeof createEventApiSchema>;

export const updateEventApiSchema = baseEventApiShape
  .omit({ restaurant_id: true, store_id: true })
  .partial()
  .required({ latitude: true, longitude: true })
  .refine((data) => isDateEndOnOrAfterStart(data.date_start, data.date_end), {
    message: "La data di fine non può essere precedente a quella di inizio",
    path: ["date_end"],
  })
  .refine((data) => isTimeEndOnOrAfterStart(data.time_start, data.time_end), {
    message: "L'orario di fine non può essere precedente a quello di inizio",
    path: ["time_end"],
  })
  .refine((data) => isUrlFieldValid(data.link), {
    message: "URL non valido",
    path: ["link"],
  });

export type UpdateEventApiPayload = z.infer<typeof updateEventApiSchema>;
