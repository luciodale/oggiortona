import { describe, it, expect } from "vitest";
import { sortRestaurants } from "./sortRestaurants";
import type { RestaurantWithStatus } from "../types/domain";
import type { PromotionRow } from "../types/database";

function makePromotion(overrides: Partial<PromotionRow> = {}): PromotionRow {
  return {
    id: 1,
    restaurantId: 1,
    type: "deal",
    title: "Test",
    description: null,
    price: null,
    dateStart: "2026-04-01",
    dateEnd: "2026-04-30",
    timeStart: null,
    timeEnd: null,
    createdAt: "2026-04-01T00:00:00",
    ...overrides,
  };
}

function makeRestaurant(overrides: Partial<RestaurantWithStatus> & { id: number; name: string }): RestaurantWithStatus {
  return {
    description: null,
    type: "bar",
    priceRange: 2,
    phone: null,
    address: "Via Roma 1",
    latitude: null,
    longitude: null,
    openingHours: "{}",
    menuUrl: null,
    ownerId: "u1",
    active: 1,
    deleted: 0,
    approved: 1,
    createdAt: "2026-01-01T00:00:00",
    updatedAt: "2026-01-01T00:00:00",
    types: ["bar"],
    isOpen: false,
    promotions: [],
    parsedHours: {
      lunedi: null,
      martedi: null,
      mercoledi: null,
      giovedi: null,
      venerdi: null,
      sabato: null,
      domenica: null,
    },
    expiredPromotionCount: 0,
    linkedEventCount: 0,
    ...overrides,
  };
}

const noPins = new Set<number>();

describe("sortRestaurants", () => {
  it("sorts pinned restaurants first", () => {
    const a = makeRestaurant({ id: 1, name: "Alfa" });
    const b = makeRestaurant({ id: 2, name: "Beta" });

    const result = sortRestaurants([a, b], new Set([2]));
    expect(result.map((r) => r.id)).toEqual([2, 1]);
  });

  it("sorts open restaurants before closed ones", () => {
    const closed = makeRestaurant({ id: 1, name: "Closed", isOpen: false });
    const open = makeRestaurant({ id: 2, name: "Open", isOpen: true });

    const result = sortRestaurants([closed, open], noPins);
    expect(result.map((r) => r.id)).toEqual([2, 1]);
  });

  it("sorts restaurants with promotions before those without", () => {
    const noPromo = makeRestaurant({ id: 1, name: "Plain" });
    const withPromo = makeRestaurant({
      id: 2,
      name: "Promo",
      promotions: [makePromotion({ id: 1, restaurantId: 2, type: "deal" })],
    });

    const result = sortRestaurants([noPromo, withPromo], noPins);
    expect(result.map((r) => r.id)).toEqual([2, 1]);
  });

  it("treats all promotion types equally (deal, special, news, generale)", () => {
    const withNews = makeRestaurant({
      id: 1,
      name: "News",
      promotions: [makePromotion({ id: 1, restaurantId: 1, type: "news", createdAt: "2026-04-10T00:00:00" })],
    });
    const withDeal = makeRestaurant({
      id: 2,
      name: "Deal",
      promotions: [makePromotion({ id: 2, restaurantId: 2, type: "deal", createdAt: "2026-04-08T00:00:00" })],
    });
    const withGenerale = makeRestaurant({
      id: 3,
      name: "Generale",
      promotions: [makePromotion({ id: 3, restaurantId: 3, type: "generale", createdAt: "2026-04-09T00:00:00" })],
    });
    const noPromo = makeRestaurant({ id: 4, name: "Nothing" });

    const result = sortRestaurants([noPromo, withDeal, withGenerale, withNews], noPins);
    // All promo restaurants before no-promo, sorted by newest createdAt desc
    expect(result.map((r) => r.id)).toEqual([1, 3, 2, 4]);
  });

  it("sorts restaurants with promotions by newest createdAt descending", () => {
    const older = makeRestaurant({
      id: 1,
      name: "Older",
      promotions: [makePromotion({ id: 1, restaurantId: 1, createdAt: "2026-04-01T00:00:00" })],
    });
    const newer = makeRestaurant({
      id: 2,
      name: "Newer",
      promotions: [makePromotion({ id: 2, restaurantId: 2, createdAt: "2026-04-10T00:00:00" })],
    });

    const result = sortRestaurants([older, newer], noPins);
    expect(result.map((r) => r.id)).toEqual([2, 1]);
  });

  it("uses the newest promotion when a restaurant has multiple", () => {
    const a = makeRestaurant({
      id: 1,
      name: "A",
      promotions: [
        makePromotion({ id: 1, restaurantId: 1, createdAt: "2026-04-01T00:00:00" }),
        makePromotion({ id: 2, restaurantId: 1, createdAt: "2026-04-12T00:00:00" }),
      ],
    });
    const b = makeRestaurant({
      id: 2,
      name: "B",
      promotions: [makePromotion({ id: 3, restaurantId: 2, createdAt: "2026-04-11T00:00:00" })],
    });

    const result = sortRestaurants([b, a], noPins);
    // A has newest promo at 04-12, B at 04-11
    expect(result.map((r) => r.id)).toEqual([1, 2]);
  });

  it("falls back to alphabetical for equal tiers", () => {
    const c = makeRestaurant({ id: 1, name: "Charlie" });
    const a = makeRestaurant({ id: 2, name: "Alfa" });
    const b = makeRestaurant({ id: 3, name: "Beta" });

    const result = sortRestaurants([c, a, b], noPins);
    expect(result.map((r) => r.id)).toEqual([2, 3, 1]);
  });

  it("full tier ordering: pinned > open > has promo > alphabetical", () => {
    const pinned = makeRestaurant({ id: 1, name: "Pinned" });
    const openWithPromo = makeRestaurant({
      id: 2,
      name: "Open Promo",
      isOpen: true,
      promotions: [makePromotion({ id: 1, restaurantId: 2, createdAt: "2026-04-05T00:00:00" })],
    });
    const openNoPromo = makeRestaurant({ id: 3, name: "Open Plain", isOpen: true });
    const closedWithPromo = makeRestaurant({
      id: 4,
      name: "Closed Promo",
      promotions: [makePromotion({ id: 2, restaurantId: 4, createdAt: "2026-04-03T00:00:00" })],
    });
    const closedNoPromo = makeRestaurant({ id: 5, name: "Closed Plain" });

    const result = sortRestaurants(
      [closedNoPromo, closedWithPromo, openNoPromo, openWithPromo, pinned],
      new Set([1]),
    );
    expect(result.map((r) => r.id)).toEqual([1, 2, 3, 4, 5]);
  });

  it("does not mutate the input array", () => {
    const list = [
      makeRestaurant({ id: 2, name: "Beta" }),
      makeRestaurant({ id: 1, name: "Alfa" }),
    ];
    const original = [...list];
    sortRestaurants(list, noPins);
    expect(list.map((r) => r.id)).toEqual(original.map((r) => r.id));
  });
});
