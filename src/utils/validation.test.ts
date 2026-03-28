import { describe, it, expect } from "vitest";
import {
  isValidItalianPhone,
  cleanPhone,
  isNonEmpty,
  isWithinLength,
} from "./validation";

describe("isValidItalianPhone", () => {
  it("accepts +39 prefix with spaces", () => {
    expect(isValidItalianPhone("+39 333 1234567")).toBe(true);
  });

  it("accepts +39 prefix without spaces", () => {
    expect(isValidItalianPhone("+393331234567")).toBe(true);
  });

  it("accepts 39 prefix without plus", () => {
    expect(isValidItalianPhone("39 333 1234567")).toBe(true);
  });

  it("accepts number with dashes", () => {
    expect(isValidItalianPhone("+39-333-1234567")).toBe(true);
  });

  it("rejects too short number", () => {
    expect(isValidItalianPhone("+39 333")).toBe(false);
  });

  it("rejects empty string", () => {
    expect(isValidItalianPhone("")).toBe(false);
  });
});

describe("cleanPhone", () => {
  it("removes spaces, dashes, and parentheses", () => {
    expect(cleanPhone("+39 (333) 123-4567")).toBe("+393331234567");
  });
});

describe("isNonEmpty", () => {
  it("returns true for non-empty string", () => {
    expect(isNonEmpty("hello")).toBe(true);
  });

  it("returns false for empty string", () => {
    expect(isNonEmpty("")).toBe(false);
  });

  it("returns false for whitespace-only string", () => {
    expect(isNonEmpty("   ")).toBe(false);
  });
});

describe("isWithinLength", () => {
  it("returns true when within limit", () => {
    expect(isWithinLength("hello", 10)).toBe(true);
  });

  it("returns true at exact limit", () => {
    expect(isWithinLength("hello", 5)).toBe(true);
  });

  it("returns false when exceeding limit", () => {
    expect(isWithinLength("hello world", 5)).toBe(false);
  });

  it("trims before checking", () => {
    expect(isWithinLength("  hi  ", 2)).toBe(true);
  });
});
