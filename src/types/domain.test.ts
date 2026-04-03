import { describe, it, expect } from "vitest";
import { isSheetMeta, isFormSheetMeta } from "./domain";

describe("isSheetMeta", () => {
  it("accepts restaurant sheet meta", () => {
    expect(isSheetMeta({ kind: "restaurant", data: {} })).toBe(true);
  });

  it("accepts event sheet meta", () => {
    expect(isSheetMeta({ kind: "event", data: {} })).toBe(true);
  });

  it("rejects null", () => {
    expect(isSheetMeta(null)).toBe(false);
  });

  it("rejects missing data", () => {
    expect(isSheetMeta({ kind: "restaurant" })).toBe(false);
  });

  it("rejects unknown kind", () => {
    expect(isSheetMeta({ kind: "unknown", data: {} })).toBe(false);
  });
});

describe("isFormSheetMeta", () => {
  it("accepts restaurant-form meta", () => {
    expect(isFormSheetMeta({ kind: "restaurant-form" })).toBe(true);
  });

  it("accepts event-form meta", () => {
    expect(isFormSheetMeta({ kind: "event-form" })).toBe(true);
  });

  it("accepts storefront meta", () => {
    expect(isFormSheetMeta({ kind: "storefront", restaurantId: 1 })).toBe(true);
  });

  it("rejects null", () => {
    expect(isFormSheetMeta(null)).toBe(false);
  });

  it("rejects unknown kind", () => {
    expect(isFormSheetMeta({ kind: "unknown" })).toBe(false);
  });

  it("rejects non-objects", () => {
    expect(isFormSheetMeta("restaurant-form")).toBe(false);
    expect(isFormSheetMeta(42)).toBe(false);
  });
});
