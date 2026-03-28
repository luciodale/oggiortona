import { describe, it, expect } from "vitest";
import { restaurantsToMapPins } from "./useMapPins";
import type { RestaurantWithStatus } from "../types/domain";
import type { OpeningHours } from "../types/database";

const EMPTY_HOURS: OpeningHours = {
  lunedi: null,
  martedi: null,
  mercoledi: null,
  giovedi: null,
  venerdi: null,
  sabato: null,
  domenica: null,
};

function makeRestaurant(overrides: Partial<RestaurantWithStatus> = {}): RestaurantWithStatus {
  return {
    id: 1,
    name: "Test Bar",
    description: null,
    type: "bar",
    priceRange: 2,
    phone: null,
    address: "Via Roma 1",
    latitude: 42.35,
    longitude: 14.40,
    openingHours: "{}",
    imageUrl: null,
    menuUrl: null,
    ownerId: "test_user",
    active: 1,
    createdAt: "2026-03-28",
    updatedAt: "2026-03-28",
    types: ["bar"],
    isOpen: true,
    promotions: [],
    parsedHours: EMPTY_HOURS,
    ...overrides,
  };
}

describe("restaurantsToMapPins", () => {
  it("converts restaurant to map pin", () => {
    const pins = restaurantsToMapPins([makeRestaurant()]);

    expect(pins).toHaveLength(1);
    expect(pins[0]?.label).toBe("Test Bar");
    expect(pins[0]?.lat).toBe(42.35);
    expect(pins[0]?.lng).toBe(14.40);
    expect(pins[0]?.variant).toBe("restaurant");
    expect(pins[0]?.href).toBe("/restaurants/1");
  });

  it("filters out restaurants without coordinates", () => {
    const pins = restaurantsToMapPins([
      makeRestaurant({ latitude: null, longitude: null }),
    ]);

    expect(pins).toHaveLength(0);
  });

  it("uses open color when restaurant is open", () => {
    const pins = restaurantsToMapPins([makeRestaurant({ isOpen: true })]);
    expect(pins[0]?.color).toBe("#c4512a");
  });

  it("uses muted color when restaurant is closed", () => {
    const pins = restaurantsToMapPins([makeRestaurant({ isOpen: false })]);
    expect(pins[0]?.color).toBe("#8c7e6f");
  });

  it("maps special promotion to pin special", () => {
    const pins = restaurantsToMapPins([
      makeRestaurant({
        promotions: [
          {
            id: 1,
            restaurantId: 1,
            type: "special",
            title: "Pasta",
            description: null,
            price: 8.5,
            dateStart: "2026-03-28",
            dateEnd: "2026-03-29",
            timeStart: null,
            timeEnd: null,
            createdAt: "2026-03-28",
          },
        ],
      }),
    ]);

    expect(pins[0]?.special).toEqual({ description: "Pasta", price: 8.5 });
  });

  it("maps deal promotion to pin deal", () => {
    const pins = restaurantsToMapPins([
      makeRestaurant({
        promotions: [
          {
            id: 2,
            restaurantId: 1,
            type: "deal",
            title: "2x1",
            description: "Birra",
            price: null,
            dateStart: "2026-03-28",
            dateEnd: "2026-04-01",
            timeStart: null,
            timeEnd: null,
            createdAt: "2026-03-28",
          },
        ],
      }),
    ]);

    expect(pins[0]?.deal).toEqual({
      title: "2x1",
      description: "Birra",
      validUntil: "2026-04-01",
    });
  });

  it("builds directions URL from coordinates", () => {
    const pins = restaurantsToMapPins([
      makeRestaurant({ latitude: 42.35, longitude: 14.40 }),
    ]);
    expect(pins[0]?.directionsUrl).toContain("42.35,14.4");
  });

  it("joins type labels for subtitle", () => {
    const pins = restaurantsToMapPins([
      makeRestaurant({ types: ["bar", "gelateria"] }),
    ]);
    expect(pins[0]?.subtitle).toBe("Bar · Gelateria");
  });
});
