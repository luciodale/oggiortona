import { describe, it, expect, vi, afterEach } from "vitest";
import {
  isThisWeek,
  isUpcoming,
  formatDateItalian,
  formatDateShort,
  relativeTime,
  getTodayISO,
} from "./date";

describe("isThisWeek", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns true for date within current week", () => {
    // Set current time to Wednesday 2025-06-18
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-18T12:00:00"));

    // Monday of same week
    expect(isThisWeek("2025-06-16")).toBe(true);
    // Sunday of same week
    expect(isThisWeek("2025-06-22")).toBe(true);
  });

  it("returns false for date in next week", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-18T12:00:00"));

    expect(isThisWeek("2025-06-23")).toBe(false);
  });

  it("returns false for date in previous week", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-18T12:00:00"));

    expect(isThisWeek("2025-06-09")).toBe(false);
  });
});

describe("isUpcoming", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns true for today", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-18T12:00:00"));

    expect(isUpcoming("2025-06-18")).toBe(true);
  });

  it("returns true for future date", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-18T12:00:00"));

    expect(isUpcoming("2025-06-25")).toBe(true);
  });

  it("returns false for past date", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-18T12:00:00"));

    expect(isUpcoming("2025-06-10")).toBe(false);
  });
});

describe("formatDateItalian", () => {
  it("formats date in Italian locale", () => {
    const result = formatDateItalian("2025-06-18");
    // Should contain the day name and date in Italian
    expect(result).toContain("18");
    expect(result).toContain("giugno");
  });
});

describe("formatDateShort", () => {
  it("formats date in short form", () => {
    const result = formatDateShort("2025-06-18");
    expect(result).toContain("18");
  });
});

describe("relativeTime", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns 'adesso' for very recent", () => {
    vi.useFakeTimers();
    const now = new Date("2025-06-18T12:00:00");
    vi.setSystemTime(now);

    expect(relativeTime("2025-06-18T12:00:00")).toBe("adesso");
  });

  it("returns minutes ago for < 60 min", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-18T12:30:00"));

    expect(relativeTime("2025-06-18T12:00:00")).toBe("30 min fa");
  });

  it("returns hours ago for < 24 hours", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-18T15:00:00"));

    expect(relativeTime("2025-06-18T12:00:00")).toBe("3 ore fa");
  });

  it("returns days ago for < 7 days", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-20T12:00:00"));

    expect(relativeTime("2025-06-18T12:00:00")).toBe("2 giorni fa");
  });
});

describe("getTodayISO", () => {
  it("returns YYYY-MM-DD format", () => {
    const result = getTodayISO();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("has no T or Z characters", () => {
    const result = getTodayISO();
    expect(result).not.toContain("T");
    expect(result).not.toContain("Z");
  });

  it("is exactly 10 characters", () => {
    expect(getTodayISO()).toHaveLength(10);
  });
});
