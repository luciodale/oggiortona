import { describe, test, expect } from "vitest";
import { computeDateEnd, isPromotionActive, daysRemaining } from "./promotions";

describe("computeDateEnd", () => {
  test("1 day duration expires same day", () => {
    expect(computeDateEnd("2026-03-28", 1)).toBe("2026-03-28");
  });

  test("3 day duration expires 2 days later", () => {
    expect(computeDateEnd("2026-03-28", 3)).toBe("2026-03-30");
  });

  test("7 day duration expires 6 days later", () => {
    expect(computeDateEnd("2026-03-28", 7)).toBe("2026-04-03");
  });

  test("handles month boundary", () => {
    expect(computeDateEnd("2026-01-30", 3)).toBe("2026-02-01");
  });

  test("handles year boundary", () => {
    expect(computeDateEnd("2025-12-30", 5)).toBe("2026-01-03");
  });
});

describe("isPromotionActive", () => {
  test("active on start day", () => {
    expect(isPromotionActive("2026-03-28", "2026-03-30", "2026-03-28")).toBe(true);
  });

  test("active on middle day", () => {
    expect(isPromotionActive("2026-03-28", "2026-03-30", "2026-03-29")).toBe(true);
  });

  test("active on last day", () => {
    expect(isPromotionActive("2026-03-28", "2026-03-30", "2026-03-30")).toBe(true);
  });

  test("inactive day before start", () => {
    expect(isPromotionActive("2026-03-28", "2026-03-30", "2026-03-27")).toBe(false);
  });

  test("inactive day after expiry", () => {
    expect(isPromotionActive("2026-03-28", "2026-03-30", "2026-03-31")).toBe(false);
  });

  test("single day promotion: active on that day only", () => {
    expect(isPromotionActive("2026-03-28", "2026-03-28", "2026-03-28")).toBe(true);
    expect(isPromotionActive("2026-03-28", "2026-03-28", "2026-03-29")).toBe(false);
  });
});

describe("daysRemaining", () => {
  test("last day returns 1", () => {
    expect(daysRemaining("2026-03-28", "2026-03-28")).toBe(1);
  });

  test("2 days left", () => {
    expect(daysRemaining("2026-03-30", "2026-03-29")).toBe(2);
  });

  test("expired returns 0", () => {
    expect(daysRemaining("2026-03-27", "2026-03-28")).toBe(0);
  });

  test("6 days remaining (inclusive)", () => {
    expect(daysRemaining("2026-04-02", "2026-03-28")).toBe(6);
  });
});
