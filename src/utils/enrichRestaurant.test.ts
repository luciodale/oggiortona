import { describe, it, expect } from "vitest";
import { groupPromotionsByRestaurant, enrichRestaurant } from "./enrichRestaurant";
import type { PromotionRow, RestaurantRow } from "../types/database";

function makePromotion(overrides: Partial<PromotionRow> & { restaurantId: number; id: number }): PromotionRow {
  return {
    type: "special",
    title: "Test",
    description: null,
    price: null,
    dateStart: "2026-03-28",
    dateEnd: "2026-03-29",
    timeStart: null,
    timeEnd: null,
    createdAt: "2026-03-28T00:00:00",
    ...overrides,
  };
}

function makeRestaurant(overrides: Partial<RestaurantRow> = {}): RestaurantRow {
  return {
    id: 1,
    name: "Test",
    description: null,
    type: "bar,ristorante",
    priceRange: 2,
    phone: null,
    address: "Via Roma 1",
    latitude: null,
    longitude: null,
    openingHours: JSON.stringify({
      lunedi: { open: "08:00", close: "22:00", open2: null, close2: null },
      martedi: null,
      mercoledi: null,
      giovedi: null,
      venerdi: null,
      sabato: null,
      domenica: null,
    }),
    menuUrl: null,
    ownerId: "test_user",
    active: 1,
    createdAt: "2026-03-28T00:00:00",
    updatedAt: "2026-03-28T00:00:00",
    ...overrides,
  };
}

describe("groupPromotionsByRestaurant", () => {
  it("groups promotions by restaurant id", () => {
    const promos = [
      makePromotion({ id: 1, restaurantId: 10 }),
      makePromotion({ id: 2, restaurantId: 20 }),
      makePromotion({ id: 3, restaurantId: 10 }),
    ];

    const result = groupPromotionsByRestaurant(promos);

    expect(result.get(10)).toHaveLength(2);
    expect(result.get(20)).toHaveLength(1);
  });

  it("limits promotions per restaurant to default of 6", () => {
    const promos = Array.from({ length: 10 }, (_, i) =>
      makePromotion({ id: i + 1, restaurantId: 1 }),
    );

    const result = groupPromotionsByRestaurant(promos);

    expect(result.get(1)).toHaveLength(6);
  });

  it("respects custom limit", () => {
    const promos = Array.from({ length: 5 }, (_, i) =>
      makePromotion({ id: i + 1, restaurantId: 1 }),
    );

    const result = groupPromotionsByRestaurant(promos, 3);

    expect(result.get(1)).toHaveLength(3);
  });

  it("returns empty map for empty input", () => {
    const result = groupPromotionsByRestaurant([]);
    expect(result.size).toBe(0);
  });
});

describe("enrichRestaurant", () => {
  it("adds types parsed from comma-separated string", () => {
    const row = makeRestaurant({ type: "bar,gelateria" });
    const result = enrichRestaurant(row, []);

    expect(result.types).toEqual(["bar", "gelateria"]);
  });

  it("includes parsedHours from openingHours JSON", () => {
    const row = makeRestaurant();
    const result = enrichRestaurant(row, []);

    expect(result.parsedHours.lunedi).toEqual({
      open: "08:00",
      close: "22:00",
      open2: null,
      close2: null,
    });
    expect(result.parsedHours.martedi).toBeNull();
  });

  it("attaches provided promotions", () => {
    const row = makeRestaurant();
    const promos = [makePromotion({ id: 1, restaurantId: 1 })];
    const result = enrichRestaurant(row, promos);

    expect(result.promotions).toHaveLength(1);
    expect(result.promotions[0]?.id).toBe(1);
  });

  it("preserves all original row fields", () => {
    const row = makeRestaurant({ name: "Ristorante Bello", priceRange: 3 });
    const result = enrichRestaurant(row, []);

    expect(result.name).toBe("Ristorante Bello");
    expect(result.priceRange).toBe(3);
    expect(result.address).toBe("Via Roma 1");
  });

  it("sets isOpen based on parsed hours", () => {
    const row = makeRestaurant();
    const result = enrichRestaurant(row, []);

    expect(typeof result.isOpen).toBe("boolean");
  });
});
