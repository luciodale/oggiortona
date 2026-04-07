import type {
  RestaurantRow,
  EventRow,
  OpeningHours,
  DaySchedule,
} from "../types/database";
import type { RestaurantFormInitialData } from "../hooks/useRestaurantForm";
import type { EventFormInitialData } from "../hooks/useEventForm";
import type { EventFormValues } from "../schemas/event";
import type {
  RestaurantFormValues,
  DayFormValues,
} from "../schemas/restaurant";
import { parseTypes } from "./restaurant";
import { parseOpeningHours } from "./time";

export function restaurantToFormData(r: RestaurantRow): RestaurantFormInitialData {
  return {
    name: r.name,
    description: r.description,
    types: parseTypes(r.type),
    priceRange: r.priceRange,
    phone: r.phone,
    address: r.address,
    latitude: r.latitude,
    longitude: r.longitude,
    menuUrl: r.menuUrl,
    parsedHours: parseOpeningHours(r.openingHours),
  };
}

export function eventToFormData(e: EventRow): EventFormInitialData {
  return {
    title: e.title,
    description: e.description,
    category: e.category,
    dateStart: e.dateStart,
    dateEnd: e.dateEnd,
    timeStart: e.timeStart,
    timeEnd: e.timeEnd,
    address: e.address,
    phone: e.phone,
    latitude: e.latitude,
    longitude: e.longitude,
    price: e.price,
    link: e.link,
    restaurantId: e.restaurantId,
  };
}

// Cleared optional fields are sent as `null` (not `undefined`) so the API
// PUT handlers actually persist the clearing. `undefined` would be stripped
// by JSON.stringify and the backend would skip the update entirely.

export function buildEventPayload(data: EventFormValues) {
  const allCategories = [
    ...data.categories,
    ...data.customCategory
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
  ];

  return {
    title: data.title,
    description: data.description || null,
    category: allCategories.join(","),
    date_start: data.dateStart,
    date_end: data.dateEnd || null,
    time_start: data.timeStart || null,
    time_end: data.timeEnd || null,
    address: data.address,
    phone: data.phone || null,
    latitude: data.latitude,
    longitude: data.longitude,
    price:
      data.price != null && !Number.isNaN(data.price) ? data.price : null,
    link: data.link || null,
    restaurant_id: data.restaurantId,
  };
}

function dayToSchedule(state: DayFormValues | undefined): DaySchedule | null {
  if (!state || state.closed) return null;
  return {
    open: state.open,
    close: state.close,
    open2: state.hasSecondShift ? state.open2 : null,
    close2: state.hasSecondShift ? state.close2 : null,
  };
}

function hoursToOpeningHours(
  hours: Record<string, DayFormValues>,
): OpeningHours {
  return {
    lunedi: dayToSchedule(hours.lunedi),
    martedi: dayToSchedule(hours.martedi),
    mercoledi: dayToSchedule(hours.mercoledi),
    giovedi: dayToSchedule(hours.giovedi),
    venerdi: dayToSchedule(hours.venerdi),
    sabato: dayToSchedule(hours.sabato),
    domenica: dayToSchedule(hours.domenica),
  };
}

export function buildRestaurantPayload(data: RestaurantFormValues) {
  const type = data.type
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
    .join(",");

  return {
    name: data.name,
    description: data.description || null,
    type,
    price_range: data.priceRange,
    phone: data.phone || null,
    address: data.address,
    latitude: data.latitude,
    longitude: data.longitude,
    opening_hours: JSON.stringify(hoursToOpeningHours(data.hours)),
    menu_url: data.menuUrl || null,
  };
}
