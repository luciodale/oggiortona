import { describe, it, expect } from "vitest";
import { buildPopupHtml } from "./map";
import type { MapPin } from "./map";
import type { PromotionRow } from "../types/database";

function makePromotion(overrides: Partial<PromotionRow> = {}): PromotionRow {
  return {
    id: 1,
    restaurantId: 1,
    type: "special",
    title: "",
    description: null,
    price: null,
    dateStart: "2026-03-30",
    dateEnd: "2026-03-30",
    timeStart: null,
    timeEnd: null,
    createdAt: "2026-03-30T00:00:00Z",
    ...overrides,
  };
}

describe("buildPopupHtml", () => {
  const basePin: MapPin = {
    id: 1,
    lat: 42.35,
    lng: 14.40,
    label: "Test Place",
    href: "/restaurants/1",
  };

  it("renders label as link", () => {
    const html = buildPopupHtml(basePin);
    expect(html).toContain('href="/restaurants/1"');
    expect(html).toContain("Test Place");
  });

  it("escapes label text", () => {
    const html = buildPopupHtml({ ...basePin, label: "A & B <C>" });
    expect(html).toContain("A &amp; B &lt;C&gt;");
  });

  it("renders open status badge", () => {
    const html = buildPopupHtml({ ...basePin, isOpen: true });
    expect(html).toContain("Aperto");
  });

  it("renders closed status badge", () => {
    const html = buildPopupHtml({ ...basePin, isOpen: false });
    expect(html).toContain("Chiuso");
  });

  it("omits status badge when isOpen is undefined", () => {
    const html = buildPopupHtml(basePin);
    expect(html).not.toContain("Aperto");
    expect(html).not.toContain("Chiuso");
  });

  it("renders price range euros", () => {
    const html = buildPopupHtml({ ...basePin, priceRange: 2 });
    expect(html).toContain("€");
  });

  it("renders subtitle when provided", () => {
    const html = buildPopupHtml({ ...basePin, subtitle: "Bar, Gelateria" });
    expect(html).toContain("Bar, Gelateria");
  });

  it("renders special section", () => {
    const html = buildPopupHtml({
      ...basePin,
      promotions: [makePromotion({ type: "special", title: "Pasta al forno", price: 8.5 })],
    });
    expect(html).toContain("Piatto del giorno");
    expect(html).toContain("Pasta al forno");
    expect(html).toContain("8.50");
  });

  it("renders deal section", () => {
    const html = buildPopupHtml({
      ...basePin,
      promotions: [makePromotion({ type: "deal", title: "2x1 Birra", description: "Solo stasera" })],
    });
    expect(html).toContain("Offerta");
    expect(html).toContain("2x1 Birra");
    expect(html).toContain("Solo stasera");
  });

  it("renders directions link when directionsUrl provided", () => {
    const html = buildPopupHtml({ ...basePin, directionsUrl: "https://maps.google.com/test" });
    expect(html).toContain("Indicazioni");
    expect(html).toContain('href="https://maps.google.com/test"');
  });

  it("omits directions when no directionsUrl", () => {
    const html = buildPopupHtml(basePin);
    expect(html).not.toContain("Indicazioni");
  });
});
