import { SwipeBarBottom, useSwipeBarContext } from "@luciodale/swipe-bar";
import { XIcon } from "../../icons/XIcon";
import { isSheetMeta } from "../../types/domain";
import { EventDetailBody } from "../events/EventDetailBody";
import { RestaurantDetailBody } from "../restaurants/RestaurantDetailBody";

function SheetContent() {
  const { bottomSidebars } = useSwipeBarContext();
  const meta = bottomSidebars.primary?.meta;

  if (!isSheetMeta(meta)) return null;

  return (
    <div className="mx-auto max-w-lg pt-4 px-5 pb-12">
      {meta.kind === "restaurant" ? (
        <RestaurantDetailBody restaurant={meta.data} />
      ) : (
        <EventDetailBody event={meta.data} />
      )}
    </div>
  );
}

function CloseButton() {
  const { closeSidebar } = useSwipeBarContext();

  function handleClose() {
    closeSidebar("bottom");
  }

  return (
    <button
      onClick={handleClose}
      className="hidden md:flex absolute top-3 right-4 items-center justify-center h-8 w-8 rounded-full bg-surface-alt text-muted hover:text-primary transition-colors"
      aria-label="Chiudi"
    >
      <XIcon className="h-5 w-5" />
    </button>
  );
}

export function DetailBottomSheet() {
  const sheetHeight = Math.round(window.innerHeight * 0.9);

  return (
    <SwipeBarBottom
      className="mx-2.5 rounded-t-3xl bg-surface shadow-[0_-4px_24px_rgba(0,0,0,0.08)] border border-b-0 border-border"
      isAbsolute
      showToggle={false}
      swipeToOpen={false}
      swipeToClose
      showOverlay
      overlayBackgroundColor="transparent"
      sidebarHeightPx={sheetHeight}
      swipeBarZIndex={50}
      overlayZIndex={45}
      resetMetaOnClose
    >
      <div className="flex flex-col" style={{ height: sheetHeight }}>
        <div className="flex shrink-0 justify-center pt-3 pb-1">
          <div className="h-1 w-9 rounded-full bg-border md:hidden" />
          <CloseButton />
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <SheetContent />
        </div>
      </div>
    </SwipeBarBottom>
  );
}
