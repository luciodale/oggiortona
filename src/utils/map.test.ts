import { describe, it, expect } from "vitest";
import { escapeHtml, buildPopupHtml } from "./map";
import type { MapPin } from "./map";

describe("escapeHtml", () => {
  it("escapes ampersands", () => {
    expect(escapeHtml("foo & bar")).toBe("foo &amp; bar");
  });

  it("escapes angle brackets", () => {
    expect(escapeHtml("<script>alert('xss')</script>")).toBe(
      "&lt;script&gt;alert('xss')&lt;/script&gt;",
    );
  });

  it("escapes double quotes", () => {
    expect(escapeHtml('a "b" c')).toBe("a &quot;b&quot; c");
  });

  it("handles empty string", () => {
    expect(escapeHtml("")).toBe("");
  });

  it("handles multiple special characters together", () => {
    expect(escapeHtml('x<y&z>"')).toBe("x&lt;y&amp;z&gt;&quot;");
  });
});

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
    expect(html).toContain("&euro;");
  });

  it("renders subtitle when provided", () => {
    const html = buildPopupHtml({ ...basePin, subtitle: "Bar, Gelateria" });
    expect(html).toContain("Bar, Gelateria");
  });

  it("renders special section", () => {
    const html = buildPopupHtml({
      ...basePin,
      special: { description: "Pasta al forno", price: 8.5 },
    });
    expect(html).toContain("Piatto del giorno");
    expect(html).toContain("Pasta al forno");
    expect(html).toContain("8.50");
  });

  it("renders deal section", () => {
    const html = buildPopupHtml({
      ...basePin,
      deal: { title: "2x1 Birra", description: "Solo stasera", validUntil: "2026-04-01" },
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
