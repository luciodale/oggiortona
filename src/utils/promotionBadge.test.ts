import { describe, it, expect } from "vitest";
import { isPromotionExpired, getBadgeStyle } from "./promotionBadge";
import type { PromotionRow } from "../types/database";

function makePromotion(dateEnd: string): PromotionRow {
  return {
    id: 1,
    restaurantId: 1,
    type: "special",
    title: "Test",
    description: null,
    price: null,
    dateStart: "2026-03-01",
    dateEnd,
    timeStart: null,
    timeEnd: null,
    createdAt: "2026-03-01",
  };
}

describe("isPromotionExpired", () => {
  it("returns true for past dates", () => {
    expect(isPromotionExpired(makePromotion("2020-01-01"))).toBe(true);
  });

  it("returns false for future dates", () => {
    expect(isPromotionExpired(makePromotion("2099-12-31"))).toBe(false);
  });
});

describe("getBadgeStyle", () => {
  it("returns special style", () => {
    const badge = getBadgeStyle("special");
    expect(badge.label).toBe("Piatto del giorno");
    expect(badge.cls).toContain("mangiare");
  });

  it("returns deal style", () => {
    const badge = getBadgeStyle("deal");
    expect(badge.label).toBe("Offerta");
    expect(badge.cls).toContain("violet");
  });

  it("returns news style", () => {
    const badge = getBadgeStyle("news");
    expect(badge.label).toBe("News");
    expect(badge.cls).toContain("sky");
  });

  it("returns fallback for unknown type", () => {
    const badge = getBadgeStyle("unknown");
    expect(badge.label).toBe("News");
  });
});
