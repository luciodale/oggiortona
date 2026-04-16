import { describe, it, expect } from "vitest";
import { formatRemainingMs } from "./cooldownFormat";

describe("formatRemainingMs", () => {
  it("returns empty string for null", () => {
    expect(formatRemainingMs(null)).toBe("");
  });

  it("returns empty string for zero or negative", () => {
    expect(formatRemainingMs(0)).toBe("");
    expect(formatRemainingMs(-1000)).toBe("");
  });

  it("formats hours and minutes", () => {
    const ms = (3 * 60 + 20) * 60 * 1000;
    expect(formatRemainingMs(ms)).toBe("3h 20m");
  });

  it("formats hours only when minutes are zero", () => {
    const ms = 2 * 60 * 60 * 1000;
    expect(formatRemainingMs(ms)).toBe("2h");
  });

  it("formats minutes only when under an hour", () => {
    const ms = 45 * 60 * 1000;
    expect(formatRemainingMs(ms)).toBe("45m");
  });

  it("rounds partial minutes up", () => {
    const ms = 61 * 1000;
    expect(formatRemainingMs(ms)).toBe("2m");
  });
});
