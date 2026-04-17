import { describe, it, expect } from "vitest";
import {
  restaurantToFormData,
  storeToFormData,
  eventToFormData,
  buildEventPayload,
  buildRestaurantPayload,
} from "./formData";
import type { RestaurantRow, StoreRow, EventRow } from "../types/database";
import type { EventFormValues } from "../schemas/event";
import type {
  RestaurantFormValues,
  DayFormValues,
} from "../schemas/restaurant";

function makeRestaurantRow(overrides: Partial<RestaurantRow> = {}): RestaurantRow {
  return {
    id: 1,
    name: "Test Restaurant",
    description: "A test place",
    type: "ristorante,pizzeria",
    cuisines: null,
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

function makeStoreRow(overrides: Partial<StoreRow> = {}): StoreRow {
  return {
    id: 1,
    name: "Test Store",
    description: "A test shop",
    type: "abbigliamento,accessori",
    phone: "+39 085 906 1234",
    address: "Via Roma 1, 66026 Ortona CH",
    latitude: 42.35,
    longitude: 14.40,
    openingHours: '{"lunedi":{"open":"09:00","close":"13:00","open2":"16:00","close2":"19:30"},"martedi":null,"mercoledi":null,"giovedi":null,"venerdi":null,"sabato":null,"domenica":null}',
    storeUrl: "https://example.com/shop",
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
    restaurantId: null,
    storeId: null,
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
    expect(result.cuisines).toEqual([]);
    expect(result.priceRange).toBe(2);
    expect(result.phone).toBe("+39 085 906 1234");
    expect(result.address).toBe("Via Roma 1, 66026 Ortona CH");
    expect(result.latitude).toBe(42.35);
    expect(result.longitude).toBe(14.40);
    expect(result.menuUrl).toBe("https://example.com/menu");
  });

  it("parses cuisines string into array", () => {
    const row = makeRestaurantRow({ cuisines: "pesce,pasta,vegetariano" });
    const result = restaurantToFormData(row);

    expect(result.cuisines).toEqual(["pesce", "pasta", "vegetariano"]);
  });

  it("returns empty cuisines array when column is null", () => {
    const row = makeRestaurantRow({ cuisines: null });
    const result = restaurantToFormData(row);

    expect(result.cuisines).toEqual([]);
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

describe("storeToFormData", () => {
  it("maps all fields from StoreRow", () => {
    const row = makeStoreRow();
    const result = storeToFormData(row);

    expect(result.name).toBe("Test Store");
    expect(result.description).toBe("A test shop");
    expect(result.types).toEqual(["abbigliamento", "accessori"]);
    expect(result.phone).toBe("+39 085 906 1234");
    expect(result.address).toBe("Via Roma 1, 66026 Ortona CH");
    expect(result.latitude).toBe(42.35);
    expect(result.longitude).toBe(14.40);
    expect(result.storeUrl).toBe("https://example.com/shop");
  });

  it("parses opening hours JSON into structured object", () => {
    const row = makeStoreRow();
    const result = storeToFormData(row);

    expect(result.parsedHours.lunedi).toEqual({
      open: "09:00",
      close: "13:00",
      open2: "16:00",
      close2: "19:30",
    });
    expect(result.parsedHours.martedi).toBeNull();
  });

  it("handles null fields", () => {
    const row = makeStoreRow({
      description: null,
      phone: null,
      latitude: null,
      longitude: null,
      storeUrl: null,
    });
    const result = storeToFormData(row);

    expect(result.description).toBeNull();
    expect(result.phone).toBeNull();
    expect(result.latitude).toBeNull();
    expect(result.longitude).toBeNull();
    expect(result.storeUrl).toBeNull();
  });
});

function makeEventFormValues(
  overrides: Partial<EventFormValues> = {},
): EventFormValues {
  return {
    title: "Sagra del Pesce",
    description: "Annual fish festival",
    categories: ["cibo"],
    customCategory: "",
    dateStart: "2026-04-10",
    dateEnd: "2026-04-12",
    timeStart: "18:00",
    timeEnd: "23:00",
    address: "Piazza della Repubblica, Ortona",
    phone: "+39 085 906 5678",
    latitude: 42.35,
    longitude: 14.40,
    price: 10,
    link: "https://example.com/event",
    restaurantId: 7,
    storeId: null,
    ...overrides,
  };
}

function openDay(): DayFormValues {
  return {
    closed: false,
    open: "12:00",
    close: "14:30",
    hasSecondShift: false,
    open2: "19:00",
    close2: "23:00",
  };
}

function closedDay(): DayFormValues {
  return {
    closed: true,
    open: "09:00",
    close: "22:00",
    hasSecondShift: false,
    open2: "19:00",
    close2: "23:00",
  };
}

function makeRestaurantFormValues(
  overrides: Partial<RestaurantFormValues> = {},
): RestaurantFormValues {
  return {
    name: "Test Restaurant",
    description: "A test place",
    type: "ristorante, pizzeria",
    cuisines: [],
    priceRange: 2,
    phone: "+39 085 906 1234",
    address: "Via Roma 1, 66026 Ortona CH",
    latitude: 42.35,
    longitude: 14.40,
    menuUrl: "https://example.com/menu",
    hours: {
      lunedi: openDay(),
      martedi: closedDay(),
      mercoledi: closedDay(),
      giovedi: closedDay(),
      venerdi: closedDay(),
      sabato: closedDay(),
      domenica: closedDay(),
    },
    ...overrides,
  };
}

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
    expect(result.restaurantId).toBeNull();
    expect(result.storeId).toBeNull();
  });

  it("preserves storeId when present", () => {
    const row = makeEventRow({ storeId: 42 });
    const result = eventToFormData(row);

    expect(result.storeId).toBe(42);
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

describe("buildEventPayload", () => {
  it("maps a fully populated form to the API payload shape", () => {
    const payload = buildEventPayload(makeEventFormValues());

    expect(payload).toEqual({
      title: "Sagra del Pesce",
      description: "Annual fish festival",
      category: "cibo",
      date_start: "2026-04-10",
      date_end: "2026-04-12",
      time_start: "18:00",
      time_end: "23:00",
      address: "Piazza della Repubblica, Ortona",
      phone: "+39 085 906 5678",
      latitude: 42.35,
      longitude: 14.40,
      price: 10,
      link: "https://example.com/event",
      restaurant_id: 7,
      store_id: null,
    });
  });

  it("merges fixed and custom categories, lowercasing only the custom ones", () => {
    const payload = buildEventPayload(
      makeEventFormValues({
        categories: ["cibo", "cultura"],
        customCategory: "Sagra, FESTA",
      }),
    );

    expect(payload.category).toBe("cibo,cultura,sagra,festa");
  });

  // Regression: clearing optional inputs in edit mode used to send `undefined`,
  // which JSON.stringify drops, causing the API PUT handler to skip the update
  // and silently keep the old value. They must be sent as explicit `null`.
  it("sends null (not undefined) for every cleared optional field", () => {
    const payload = buildEventPayload(
      makeEventFormValues({
        description: "",
        dateEnd: "",
        timeStart: "",
        timeEnd: "",
        phone: "",
        price: null,
        link: "",
        restaurantId: null,
      }),
    );

    expect(payload.description).toBeNull();
    expect(payload.date_end).toBeNull();
    expect(payload.time_start).toBeNull();
    expect(payload.time_end).toBeNull();
    expect(payload.phone).toBeNull();
    expect(payload.price).toBeNull();
    expect(payload.link).toBeNull();
    expect(payload.restaurant_id).toBeNull();

    // The keys must survive JSON serialization so the backend sees them.
    const serialized = JSON.parse(JSON.stringify(payload)) as Record<
      string,
      unknown
    >;
    expect(serialized.description).toBeNull();
    expect(serialized.date_end).toBeNull();
    expect(serialized.time_start).toBeNull();
    expect(serialized.time_end).toBeNull();
    expect(serialized.phone).toBeNull();
    expect(serialized.price).toBeNull();
    expect(serialized.link).toBeNull();
    expect(serialized.restaurant_id).toBeNull();
    expect("link" in serialized).toBe(true);
    expect("restaurant_id" in serialized).toBe(true);
  });

  it("sends null when price is NaN (cleared number input)", () => {
    const payload = buildEventPayload(
      makeEventFormValues({ price: Number.NaN }),
    );

    expect(payload.price).toBeNull();
  });

  it("allows detaching a restaurant by passing restaurantId null", () => {
    const populated = buildEventPayload(makeEventFormValues({ restaurantId: 42 }));
    expect(populated.restaurant_id).toBe(42);

    const detached = buildEventPayload(makeEventFormValues({ restaurantId: null }));
    expect(detached.restaurant_id).toBeNull();
    const serialized = JSON.parse(JSON.stringify(detached)) as Record<
      string,
      unknown
    >;
    expect("restaurant_id" in serialized).toBe(true);
    expect(serialized.restaurant_id).toBeNull();
  });
});

describe("buildRestaurantPayload", () => {
  it("maps a fully populated form to the API payload shape", () => {
    const payload = buildRestaurantPayload(makeRestaurantFormValues());

    expect(payload.name).toBe("Test Restaurant");
    expect(payload.description).toBe("A test place");
    expect(payload.type).toBe("ristorante,pizzeria");
    expect(payload.price_range).toBe(2);
    expect(payload.phone).toBe("+39 085 906 1234");
    expect(payload.address).toBe("Via Roma 1, 66026 Ortona CH");
    expect(payload.latitude).toBe(42.35);
    expect(payload.longitude).toBe(14.40);
    expect(payload.menu_url).toBe("https://example.com/menu");
  });

  it("serializes opening hours into the expected JSON shape", () => {
    const payload = buildRestaurantPayload(makeRestaurantFormValues());
    const parsed = JSON.parse(payload.opening_hours) as Record<string, unknown>;

    expect(parsed.lunedi).toEqual({
      open: "12:00",
      close: "14:30",
      open2: null,
      close2: null,
    });
    expect(parsed.martedi).toBeNull();
    expect(parsed.domenica).toBeNull();
  });

  it("includes the second shift only when hasSecondShift is true", () => {
    const payload = buildRestaurantPayload(
      makeRestaurantFormValues({
        hours: {
          lunedi: {
            closed: false,
            open: "12:00",
            close: "14:30",
            hasSecondShift: true,
            open2: "19:00",
            close2: "22:30",
          },
          martedi: closedDay(),
          mercoledi: closedDay(),
          giovedi: closedDay(),
          venerdi: closedDay(),
          sabato: closedDay(),
          domenica: closedDay(),
        },
      }),
    );
    const parsed = JSON.parse(payload.opening_hours) as Record<string, unknown>;

    expect(parsed.lunedi).toEqual({
      open: "12:00",
      close: "14:30",
      open2: "19:00",
      close2: "22:30",
    });
  });

  // Regression: same bug as buildEventPayload — cleared optionals were sent as
  // `undefined`, JSON.stringify dropped them, the API PUT handler skipped the
  // update, and the cleared field appeared to never persist.
  it("sends null (not undefined) for every cleared optional field", () => {
    const payload = buildRestaurantPayload(
      makeRestaurantFormValues({
        description: "",
        phone: "",
        menuUrl: "",
      }),
    );

    expect(payload.description).toBeNull();
    expect(payload.phone).toBeNull();
    expect(payload.menu_url).toBeNull();

    const serialized = JSON.parse(JSON.stringify(payload)) as Record<
      string,
      unknown
    >;
    expect(serialized.description).toBeNull();
    expect(serialized.phone).toBeNull();
    expect(serialized.menu_url).toBeNull();
    expect("menu_url" in serialized).toBe(true);
  });

  it("normalizes the type input by trimming, lowercasing and dropping empties", () => {
    const payload = buildRestaurantPayload(
      makeRestaurantFormValues({ type: "Ristorante,  PIZZERIA , ,Bar" }),
    );

    expect(payload.type).toBe("ristorante,pizzeria,bar");
  });
});
