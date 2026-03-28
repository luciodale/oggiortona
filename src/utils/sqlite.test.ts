import { describe, test, expect } from "vitest";
import { nowItalyFormatted } from "./sqlite";

describe("nowItalyFormatted", () => {
  test("returns YYYY-MM-DD HH:MM:SS format", () => {
    const result = nowItalyFormatted();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
  });

  test("has no T separator", () => {
    expect(nowItalyFormatted()).not.toContain("T");
  });

  test("has no Z suffix", () => {
    expect(nowItalyFormatted()).not.toContain("Z");
  });

  test("has no milliseconds", () => {
    expect(nowItalyFormatted()).not.toContain(".");
  });

  test("is comparable with SQLite datetime format", () => {
    const now = nowItalyFormatted();
    const sqliteFormat = "2026-03-28 18:30:00";
    expect(typeof (now > sqliteFormat)).toBe("boolean");
    expect(now.length).toBe(sqliteFormat.length);
  });
});
