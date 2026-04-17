import { useSwipeBarContext } from "@luciodale/swipe-bar";
import type { RestaurantRow, StoreRow, EventRow, PromotionRow, StorePromotionRow } from "../types/database";
import type { FormSheetMeta } from "../types/domain";
import { restaurantToFormData, storeToFormData, eventToFormData } from "../utils/formData";

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

  function openStoreForm(store?: StoreRow) {
    const meta: FormSheetMeta = {
      kind: "store-form",
      storeId: store?.id,
      initialData: store ? storeToFormData(store) : undefined,
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

  function openStoreStorefront(storeId: number) {
    const meta: FormSheetMeta = { kind: "store-storefront", storeId };
    openSidebarFully("bottom", { id: "form", meta });
  }

  function openPromotionsList(restaurantId: number) {
    const meta: FormSheetMeta = { kind: "promotions-list", restaurantId };
    openSidebarFully("bottom", { id: "form", meta });
  }

  function openStorePromotionsList(storeId: number) {
    const meta: FormSheetMeta = { kind: "store-promotions-list", storeId };
    openSidebarFully("bottom", { id: "form", meta });
  }

  function openPromotionEdit(restaurantId: number, promotion: PromotionRow) {
    const meta: FormSheetMeta = { kind: "promotion-edit", restaurantId, promotion };
    openSidebarFully("bottom", { id: "form", meta });
  }

  function openStorePromotionEdit(storeId: number, promotion: StorePromotionRow) {
    const meta: FormSheetMeta = { kind: "store-promotion-edit", storeId, promotion };
    openSidebarFully("bottom", { id: "form", meta });
  }

  function closeForm() {
    closeSidebar("bottom", { id: "form" });
  }

  return {
    openRestaurantForm,
    openStoreForm,
    openEventForm,
    openStorefront,
    openStoreStorefront,
    openPromotionsList,
    openStorePromotionsList,
    openPromotionEdit,
    openStorePromotionEdit,
    closeForm,
  };
}
