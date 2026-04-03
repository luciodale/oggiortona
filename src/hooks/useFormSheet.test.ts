import { describe, it, expect } from "vitest";
import { restaurantToFormData, eventToFormData } from "../utils/formData";
import type { RestaurantRow, EventRow } from "../types/database";

function makeRestaurantRow(overrides: Partial<RestaurantRow> = {}): RestaurantRow {
  return {
    id: 1,
    name: "Test Restaurant",
    description: "A test place",
    type: "ristorante,pizzeria",
    priceRange: 2,
    phone: "+39 085 906 1234",
    address: "Via Roma 1, 66026 Ortona CH",
    latitude: 42.35,
    longitude: 14.40,
    openingHours: '{"lunedi":{"open":"12:00","close":"14:30","open2":"19:00","close2":"22:30"},"martedi":null,"mercoledi":null,"giovedi":null,"venerdi":null,"sabato":null,"domenica":null}',
    menuUrl: "https://example.com/menu",
    ownerId: "user_1",
    active: 1,
    deleted: 0,
    approved: 1,
    createdAt: "2026-03-28",
    updatedAt: "2026-03-28",
    ...overrides,
  };
}

function makeEventRow(overrides: Partial<EventRow> = {}): EventRow {
  return {
    id: 1,
    title: "Sagra del Pesce",
    description: "Annual fish festival",
    dateStart: "2026-04-10",
    dateEnd: "2026-04-12",
    timeStart: "18:00",
    timeEnd: "23:00",
    address: "Piazza della Repubblica, Ortona",
    phone: "+39 085 906 5678",
    latitude: 42.35,
    longitude: 14.40,
    category: "cibo,sagra",
    price: 10,
    link: "https://example.com/event",
    ownerId: "user_1",
    active: 1,
    deleted: 0,
    approved: 1,
    highlighted: 0,
    createdAt: "2026-03-28",
    updatedAt: "2026-03-28",
    ...overrides,
  };
}

describe("restaurantToFormData", () => {
  it("maps all fields from RestaurantRow", () => {
    const row = makeRestaurantRow();
    const result = restaurantToFormData(row);

    expect(result.name).toBe("Test Restaurant");
    expect(result.description).toBe("A test place");
    expect(result.types).toEqual(["ristorante", "pizzeria"]);
    expect(result.priceRange).toBe(2);
    expect(result.phone).toBe("+39 085 906 1234");
    expect(result.address).toBe("Via Roma 1, 66026 Ortona CH");
    expect(result.latitude).toBe(42.35);
    expect(result.longitude).toBe(14.40);
    expect(result.menuUrl).toBe("https://example.com/menu");
  });

  it("parses opening hours JSON into structured object", () => {
    const row = makeRestaurantRow();
    const result = restaurantToFormData(row);

    expect(result.parsedHours.lunedi).toEqual({
      open: "12:00",
      close: "14:30",
      open2: "19:00",
      close2: "22:30",
    });
    expect(result.parsedHours.martedi).toBeNull();
  });

  it("handles null fields", () => {
    const row = makeRestaurantRow({
      description: null,
      phone: null,
      latitude: null,
      longitude: null,
      menuUrl: null,
    });
    const result = restaurantToFormData(row);

    expect(result.description).toBeNull();
    expect(result.phone).toBeNull();
    expect(result.latitude).toBeNull();
    expect(result.longitude).toBeNull();
    expect(result.menuUrl).toBeNull();
  });
});

describe("eventToFormData", () => {
  it("maps all fields from EventRow", () => {
    const row = makeEventRow();
    const result = eventToFormData(row);

    expect(result.title).toBe("Sagra del Pesce");
    expect(result.description).toBe("Annual fish festival");
    expect(result.category).toBe("cibo,sagra");
    expect(result.dateStart).toBe("2026-04-10");
    expect(result.dateEnd).toBe("2026-04-12");
    expect(result.timeStart).toBe("18:00");
    expect(result.timeEnd).toBe("23:00");
    expect(result.address).toBe("Piazza della Repubblica, Ortona");
    expect(result.phone).toBe("+39 085 906 5678");
    expect(result.latitude).toBe(42.35);
    expect(result.longitude).toBe(14.40);
    expect(result.price).toBe(10);
    expect(result.link).toBe("https://example.com/event");
  });

  it("handles null optional fields", () => {
    const row = makeEventRow({
      description: null,
      dateEnd: null,
      timeStart: null,
      timeEnd: null,
      phone: null,
      latitude: null,
      longitude: null,
      price: null,
      link: null,
    });
    const result = eventToFormData(row);

    expect(result.description).toBeNull();
    expect(result.dateEnd).toBeNull();
    expect(result.timeStart).toBeNull();
    expect(result.timeEnd).toBeNull();
    expect(result.phone).toBeNull();
    expect(result.latitude).toBeNull();
    expect(result.longitude).toBeNull();
    expect(result.price).toBeNull();
    expect(result.link).toBeNull();
  });
});
