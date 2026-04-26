import { useCallback, useEffect, useRef, useState } from "react";
import { SwipeBarBottom, useSwipeBarContext } from "@luciodale/swipe-bar";
import { toast } from "sonner";
import { XIcon } from "../../icons/XIcon";
import { isFormSheetMeta } from "../../types/domain";
import { useFormSheet } from "../../hooks/useFormSheet";
import { RestaurantForm } from "../restaurants/RestaurantForm";
import { StoreForm } from "../stores/StoreForm";
import { EventForm } from "../events/EventForm";
import { ProfileStorefront } from "../profile/ProfileStorefront";
import { ProfileStoreStorefront } from "../profile/ProfileStoreStorefront";
import { ProfilePromotionsList } from "../profile/ProfilePromotionsList";
import { ProfileStorePromotionsList } from "../profile/ProfileStorePromotionsList";
import { ProfilePromotionEdit } from "../profile/ProfilePromotionEdit";
import { ProfileStorePromotionEdit } from "../profile/ProfileStorePromotionEdit";

function getTitle(meta: ReturnType<typeof useSwipeBarContext>["bottomSidebars"]["form"]["meta"]) {
  if (!isFormSheetMeta(meta)) return "";
  if (meta.kind === "restaurant-form") return meta.restaurantId ? "Modifica locale" : "Aggiungi locale";
  if (meta.kind === "store-form") return meta.storeId ? "Modifica negozio" : "Aggiungi negozio";
  if (meta.kind === "event-form") return meta.eventId ? "Modifica evento" : "Aggiungi evento";
  if (meta.kind === "promotions-list") return "Pubblicazioni";
  if (meta.kind === "store-promotions-list") return "Pubblicazioni";
  if (meta.kind === "promotion-edit") return "Modifica pubblicazione";
  if (meta.kind === "store-promotion-edit") return "Modifica pubblicazione";
  return "Pubblica";
}

export function FormBottomSheet() {
  const [sheetHeight, setSheetHeight] = useState(() => window.innerHeight);
  const { bottomSidebars } = useSwipeBarContext();
  const { closeForm } = useFormSheet();
  const isDirtyRef = useRef(false);

  useEffect(function trackViewportHeight() {
    function onResize() {
      setSheetHeight(window.innerHeight);
    }
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, []);

  const meta = bottomSidebars.form?.meta;
  const validMeta = isFormSheetMeta(meta) ? meta : null;
  const isFormKind = validMeta?.kind === "restaurant-form" || validMeta?.kind === "store-form" || validMeta?.kind === "event-form";

  function handleClose() {
    if (!isFormKind || !isDirtyRef.current) {
      closeForm();
      return;
    }
    toast("Hai modifiche non salvate. Vuoi chiudere?", {
      duration: Infinity,
      action: { label: "Chiudi", onClick: () => closeForm() },
      cancel: { label: "Annulla", onClick: () => {} },
    });
  }

  const handleDirtyChange = useCallback(function handleDirtyChange(dirty: boolean) {
    isDirtyRef.current = dirty;
  }, []);

  return (
    <SwipeBarBottom
      id="form"
      className="bg-surface"
      isAbsolute
      showToggle={false}
      swipeToOpen={false}
      swipeToClose={false}
      showOverlay
      overlayBackgroundColor="transparent"
      closeSidebarOnOverlayClick={false}
      sidebarHeightPx={sheetHeight}
      swipeBarZIndex={50}
      overlayZIndex={45}
      resetMetaOnClose
    >
      <div className="flex flex-col" style={{ height: sheetHeight }}>
        {validMeta && (
          <div className="flex shrink-0 items-center justify-between px-5 pb-2 pt-safe">
            <h2 className="font-family-display text-xl font-medium tracking-tight text-primary">
              {getTitle(meta)}
            </h2>
            <button
              type="button"
              onClick={handleClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-alt text-muted transition-colors hover:text-primary"
              aria-label="Chiudi"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {validMeta && (
            <div className="mx-auto max-w-lg px-5 pb-12">
              {validMeta.kind === "restaurant-form" && (
                <RestaurantForm
                  restaurantId={validMeta.restaurantId}
                  initialData={validMeta.initialData}
                  onSuccess={closeForm}
                  onDirtyChange={handleDirtyChange}
                />
              )}
              {validMeta.kind === "store-form" && (
                <StoreForm
                  storeId={validMeta.storeId}
                  initialData={validMeta.initialData}
                  onSuccess={closeForm}
                  onDirtyChange={handleDirtyChange}
                />
              )}
              {validMeta.kind === "event-form" && (
                <EventForm
                  eventId={validMeta.eventId}
                  initialData={validMeta.initialData}
                  onSuccess={closeForm}
                  onDirtyChange={handleDirtyChange}
                />
              )}
              {validMeta.kind === "storefront" && (
                <ProfileStorefront restaurantId={String(validMeta.restaurantId)} />
              )}
              {validMeta.kind === "store-storefront" && (
                <ProfileStoreStorefront storeId={String(validMeta.storeId)} />
              )}
              {validMeta.kind === "promotions-list" && (
                <ProfilePromotionsList restaurantId={String(validMeta.restaurantId)} />
              )}
              {validMeta.kind === "store-promotions-list" && (
                <ProfileStorePromotionsList storeId={String(validMeta.storeId)} />
              )}
              {validMeta.kind === "promotion-edit" && (
                <ProfilePromotionEdit
                  restaurantId={String(validMeta.restaurantId)}
                  promotion={validMeta.promotion}
                  onSuccess={closeForm}
                />
              )}
              {validMeta.kind === "store-promotion-edit" && (
                <ProfileStorePromotionEdit
                  storeId={String(validMeta.storeId)}
                  promotion={validMeta.promotion}
                  onSuccess={closeForm}
                />
              )}
              <button
                type="button"
                onClick={handleClose}
                className="mt-3 w-full rounded-xl border border-border py-3 text-center text-[13px] font-semibold text-muted transition-colors hover:text-primary"
              >
                Chiudi
              </button>
            </div>
          )}
        </div>
      </div>
    </SwipeBarBottom>
  );
}
