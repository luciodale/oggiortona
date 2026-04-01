import { SwipeBarBottom, useSwipeBarContext } from "@luciodale/swipe-bar";
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

export function DetailBottomSheet() {

  return (
    <SwipeBarBottom
      className="rounded-t-3xl bg-surface shadow-[0_-4px_24px_rgba(0,0,0,0.08)]"
      isAbsolute
      showToggle={false}
      swipeToOpen={false}
      swipeToClose
      showOverlay
      overlayBackgroundColor="transparent"
      sidebarHeightPx={Math.round(window.innerHeight * 0.9)}
      swipeBarZIndex={50}
      overlayZIndex={45}
      resetMetaOnClose
    >
        <div className="overflow-y-auto overscroll-contain" style={{ height: Math.round(window.innerHeight * 0.9) }}>
          <div className="sticky top-0 z-10 flex justify-center bg-surface pt-2.5 pb-2 rounded-t-3xl">
            <div className="h-1 w-9 rounded-full bg-border" />
          </div>
          <SheetContent />
        </div>
      </SwipeBarBottom>
  );
}
