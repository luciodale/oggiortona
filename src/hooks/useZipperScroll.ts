import { useEffect, useRef } from "react";

const ZONE_START = 1.05;
const ZONE_END = 0.75;
const MAX_OFFSET_X = 120;
const MAX_BLUR = 12;
const MIN_SCALE = 0.88;

export function useZipperScroll(containerRef: React.RefObject<HTMLDivElement | null>) {
  const cardsRef = useRef<Array<HTMLElement>>([]);
  const tickingRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let vh = window.innerHeight;

    function collectCards() {
      cardsRef.current = Array.from(container!.querySelectorAll(".zipper-card"));
      updateCards();
    }

    function updateCards() {
      const zoneTopPx = vh * ZONE_END;
      const zoneBotPx = vh * ZONE_START;
      const zoneRange = zoneBotPx - zoneTopPx;
      if (zoneRange <= 0) return;

      const cards = cardsRef.current;
      for (let i = 0; i < cards.length; i++) {
        const card = cards[i]!;
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.top + rect.height / 2;

        const progress = Math.max(0, Math.min(1, (cardCenter - zoneTopPx) / zoneRange));

        if (progress <= 0) {
          card.style.setProperty("--zip-x", "0px");
          card.style.setProperty("--zip-scale", "1");
          card.removeAttribute("data-zip-blur");
        } else {
          const eased = progress * progress;
          const direction = i % 2 === 0 ? -1 : 1;

          card.style.setProperty("--zip-x", `${eased * MAX_OFFSET_X * direction}px`);
          card.style.setProperty("--zip-scale", `${1 - eased * (1 - MIN_SCALE)}`);
          card.style.setProperty("--zip-blur", `${eased * MAX_BLUR}px`);
          if (!card.hasAttribute("data-zip-blur")) {
            card.setAttribute("data-zip-blur", "");
          }
        }

        if (!card.hasAttribute("data-zip-ready")) {
          card.setAttribute("data-zip-ready", "");
        }
      }
    }

    function onScroll() {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(() => {
        updateCards();
        tickingRef.current = false;
      });
    }

    function onResize() {
      vh = window.innerHeight;
      updateCards();
    }

    const scrollTarget = document.getElementById("main-content");
    if (!scrollTarget) return;

    collectCards();
    scrollTarget.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    const mo = new MutationObserver(collectCards);
    mo.observe(container, { childList: true, subtree: true });

    return () => {
      scrollTarget.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      mo.disconnect();
    };
  }, [containerRef]);
}
