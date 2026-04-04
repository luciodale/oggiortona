import type { RestaurantRow, EventRow } from "../types/database";
import type { RestaurantFormInitialData } from "../hooks/useRestaurantForm";
import type { EventFormInitialData } from "../hooks/useEventForm";
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
