import { z } from "zod";

const timeString = z.string().regex(/^\d{2}:\d{2}$/);

const daySchedule = z.object({
  open: timeString,
  close: timeString,
  open2: z.union([timeString, z.null()]),
  close2: z.union([timeString, z.null()]),
});

const openingHoursShape = z.object({
  lunedi: z.union([daySchedule, z.null()]),
  martedi: z.union([daySchedule, z.null()]),
  mercoledi: z.union([daySchedule, z.null()]),
  giovedi: z.union([daySchedule, z.null()]),
  venerdi: z.union([daySchedule, z.null()]),
  sabato: z.union([daySchedule, z.null()]),
  domenica: z.union([daySchedule, z.null()]),
});

export function isValidOpeningHoursJson(value: string): boolean {
  try {
    const parsed = JSON.parse(value);
    return openingHoursShape.safeParse(parsed).success;
  } catch {
    return false;
  }
}
