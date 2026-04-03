import { useSwipeBarContext } from "@luciodale/swipe-bar";
import type { RestaurantRow, EventRow } from "../types/database";
import type { FormSheetMeta } from "../types/domain";
import { restaurantToFormData, eventToFormData } from "../utils/formData";

export function useFormSheet() {
  const { openSidebarFully, closeSidebar } = useSwipeBarContext();

  function openRestaurantForm(restaurant?: RestaurantRow) {
    const meta: FormSheetMeta = {
      kind: "restaurant-form",
      restaurantId: restaurant?.id,
      initialData: restaurant ? restaurantToFormData(restaurant) : undefined,
    };
    openSidebarFully("bottom", { id: "form", meta });
  }

  function openEventForm(event?: EventRow) {
    const meta: FormSheetMeta = {
      kind: "event-form",
      eventId: event?.id,
      initialData: event ? eventToFormData(event) : undefined,
    };
    openSidebarFully("bottom", { id: "form", meta });
  }

  function openStorefront(restaurantId: number) {
    const meta: FormSheetMeta = { kind: "storefront", restaurantId };
    openSidebarFully("bottom", { id: "form", meta });
  }

  function closeForm() {
    closeSidebar("bottom", { id: "form" });
  }

  return { openRestaurantForm, openEventForm, openStorefront, closeForm };
}
