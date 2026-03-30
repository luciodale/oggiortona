import { describe, it, expect, vi, afterEach } from "vitest";
import {
  isThisWeek,
  isUpcoming,
  isToday,
  formatDateLong,
  formatDateShort,
  relativeTime,
  getTodayISO,
} from "./date";

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

  it("returns Italy date, not UTC date, near midnight", () => {
    vi.useFakeTimers();
    // 2025-06-18T23:30:00Z = June 19 01:30 in Rome (CEST UTC+2)
    vi.setSystemTime(new Date("2025-06-18T23:30:00Z"));
    expect(getTodayISO()).toBe("2025-06-19");
    vi.useRealTimers();
  });
});

describe("isToday", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns true when dateStart equals today", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-18T12:00:00Z"));
    expect(isToday("2025-06-18", null)).toBe(true);
  });

  it("returns false when dateStart is a different day", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-18T12:00:00Z"));
    expect(isToday("2025-06-17", null)).toBe(false);
  });

  it("returns true when today falls within dateStart..dateEnd range", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-18T12:00:00Z"));
    expect(isToday("2025-06-16", "2025-06-20")).toBe(true);
  });

  it("returns false when today is outside dateStart..dateEnd range", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-18T12:00:00Z"));
    expect(isToday("2025-06-19", "2025-06-22")).toBe(false);
  });

  it("uses Italy timezone near midnight UTC", () => {
    vi.useFakeTimers();
    // 2025-06-18T23:30:00Z = June 19 01:30 in Rome
    vi.setSystemTime(new Date("2025-06-18T23:30:00Z"));
    expect(isToday("2025-06-19", null)).toBe(true);
    expect(isToday("2025-06-18", null)).toBe(false);
  });
});

describe("isThisWeek", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns true for date within current week", () => {
    vi.useFakeTimers();
    // Wednesday 2025-06-18
    vi.setSystemTime(new Date("2025-06-18T12:00:00Z"));

    // Monday of same week
    expect(isThisWeek("2025-06-16")).toBe(true);
    // Sunday of same week
    expect(isThisWeek("2025-06-22")).toBe(true);
    // Wednesday (today)
    expect(isThisWeek("2025-06-18")).toBe(true);
  });

  it("returns false for date in next week", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-18T12:00:00Z"));

    expect(isThisWeek("2025-06-23")).toBe(false);
  });

  it("returns false for date in previous week", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-18T12:00:00Z"));

    expect(isThisWeek("2025-06-09")).toBe(false);
  });

  it("handles Sunday as last day of week (Mon-Sun)", () => {
    vi.useFakeTimers();
    // Sunday 2025-06-22
    vi.setSystemTime(new Date("2025-06-22T12:00:00Z"));

    // Monday of same week
    expect(isThisWeek("2025-06-16")).toBe(true);
    // Sunday (today)
    expect(isThisWeek("2025-06-22")).toBe(true);
    // Next Monday
    expect(isThisWeek("2025-06-23")).toBe(false);
  });

  it("handles Monday as first day of week", () => {
    vi.useFakeTimers();
    // Monday 2025-06-16
    vi.setSystemTime(new Date("2025-06-16T12:00:00Z"));

    expect(isThisWeek("2025-06-16")).toBe(true);
    expect(isThisWeek("2025-06-22")).toBe(true);
    expect(isThisWeek("2025-06-15")).toBe(false);
  });

  it("uses Italy timezone near midnight UTC", () => {
    vi.useFakeTimers();
    // 2025-06-22T23:30:00Z = June 23 01:30 in Rome (Monday)
    vi.setSystemTime(new Date("2025-06-22T23:30:00Z"));

    // In Italy it's already Monday June 23 → new week
    expect(isThisWeek("2025-06-22")).toBe(false);
    expect(isThisWeek("2025-06-23")).toBe(true);
  });
});

describe("isUpcoming", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns true for today", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-18T12:00:00Z"));
    expect(isUpcoming("2025-06-18")).toBe(true);
  });

  it("returns true for future date", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-18T12:00:00Z"));
    expect(isUpcoming("2025-06-25")).toBe(true);
  });

  it("returns false for past date", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-18T12:00:00Z"));
    expect(isUpcoming("2025-06-10")).toBe(false);
  });

  it("uses Italy timezone near midnight UTC", () => {
    vi.useFakeTimers();
    // 2025-06-18T23:30:00Z = June 19 in Rome
    vi.setSystemTime(new Date("2025-06-18T23:30:00Z"));
    // June 19 is today in Rome → upcoming
    expect(isUpcoming("2025-06-19")).toBe(true);
    // June 18 is yesterday in Rome → not upcoming
    expect(isUpcoming("2025-06-18")).toBe(false);
  });
});

describe("formatDateLong", () => {
  it("formats date in Italian locale", () => {
    const result = formatDateLong("2025-06-18", "it");
    expect(result).toContain("18");
    expect(result).toContain("giugno");
  });

  it("formats date in English locale", () => {
    const result = formatDateLong("2025-06-18", "en");
    expect(result).toContain("18");
    expect(result).toContain("June");
  });

  it("preserves correct day regardless of system timezone", () => {
    // "2025-06-18" should always display as day 18 in Rome
    const result = formatDateLong("2025-06-18", "it");
    expect(result).toContain("18");
    expect(result).not.toContain("17");
  });
});

describe("formatDateShort", () => {
  it("formats date in short form", () => {
    const result = formatDateShort("2025-06-18", "it");
    expect(result).toContain("18");
  });

  it("preserves correct day regardless of system timezone", () => {
    const result = formatDateShort("2025-06-18", "it");
    expect(result).toContain("18");
    expect(result).not.toContain("17");
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

    expect(relativeTime("2025-06-18T12:00:00", "it")).toBe("adesso");
  });

  it("returns minutes ago for < 60 min", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-18T12:30:00"));

    expect(relativeTime("2025-06-18T12:00:00", "it")).toBe("30 min fa");
  });

  it("returns hours ago for < 24 hours", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-18T15:00:00"));

    expect(relativeTime("2025-06-18T12:00:00", "it")).toBe("3 ore fa");
  });

  it("returns days ago for < 7 days", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-20T12:00:00"));

    expect(relativeTime("2025-06-18T12:00:00", "it")).toBe("2 giorni fa");
  });

  it("falls back to formatDateShort for >= 7 days", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-30T12:00:00"));

    const result = relativeTime("2025-06-18T12:00:00", "it");
    expect(result).toContain("18");
  });
});
