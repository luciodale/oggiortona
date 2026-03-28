import { describe, it, expect } from "vitest";
import {
  isOpenNow,
  getItalianDayName,
  getDayLabel,
  getOrderedDays,
  formatSchedule,
  parseOpeningHours,
  isUtcDatetimeInFuture,
  formatUtcAsItalianTime,
} from "./time";
import type { OpeningHours } from "../types/database";

const FULL_WEEK_HOURS: OpeningHours = {
  lunedi: { open: "12:00", close: "15:00", open2: "19:00", close2: "23:00" },
  martedi: { open: "12:00", close: "15:00", open2: "19:00", close2: "23:00" },
  mercoledi: { open: "12:00", close: "15:00", open2: "19:00", close2: "23:00" },
  giovedi: { open: "12:00", close: "15:00", open2: "19:00", close2: "23:00" },
  venerdi: { open: "12:00", close: "15:00", open2: "19:00", close2: "23:00" },
  sabato: { open: "12:00", close: "15:00", open2: "19:00", close2: "23:00" },
  domenica: { open: "12:00", close: "15:00", open2: null, close2: null },
};

const CLOSED_MONDAY: OpeningHours = {
  ...FULL_WEEK_HOURS,
  lunedi: null,
};

describe("isOpenNow", () => {
  it("returns true during first shift", () => {
    // Wednesday at 13:00
    const now = new Date("2025-06-18T13:00:00");
    expect(isOpenNow(FULL_WEEK_HOURS, now)).toBe(true);
  });

  it("returns true during second shift", () => {
    // Wednesday at 20:00
    const now = new Date("2025-06-18T20:00:00");
    expect(isOpenNow(FULL_WEEK_HOURS, now)).toBe(true);
  });

  it("returns false between shifts", () => {
    // Wednesday at 16:00
    const now = new Date("2025-06-18T16:00:00");
    expect(isOpenNow(FULL_WEEK_HOURS, now)).toBe(false);
  });

  it("returns false before opening", () => {
    // Wednesday at 10:00
    const now = new Date("2025-06-18T10:00:00");
    expect(isOpenNow(FULL_WEEK_HOURS, now)).toBe(false);
  });

  it("returns false after closing", () => {
    // Wednesday at 23:30
    const now = new Date("2025-06-18T23:30:00");
    expect(isOpenNow(FULL_WEEK_HOURS, now)).toBe(false);
  });

  it("returns false on closed day", () => {
    // Monday at 13:00
    const now = new Date("2025-06-16T13:00:00");
    expect(isOpenNow(CLOSED_MONDAY, now)).toBe(false);
  });

  it("returns true on sunday with single shift", () => {
    // Sunday at 13:00
    const now = new Date("2025-06-22T13:00:00");
    expect(isOpenNow(FULL_WEEK_HOURS, now)).toBe(true);
  });

  it("returns false on sunday evening with no second shift", () => {
    // Sunday at 20:00
    const now = new Date("2025-06-22T20:00:00");
    expect(isOpenNow(FULL_WEEK_HOURS, now)).toBe(false);
  });

  it("handles closing time boundary (exclusive)", () => {
    // Wednesday at exactly 15:00 (close time)
    const now = new Date("2025-06-18T15:00:00");
    expect(isOpenNow(FULL_WEEK_HOURS, now)).toBe(false);
  });

  it("handles opening time boundary (inclusive)", () => {
    // Wednesday at exactly 12:00 (open time)
    const now = new Date("2025-06-18T12:00:00");
    expect(isOpenNow(FULL_WEEK_HOURS, now)).toBe(true);
  });
});

describe("getItalianDayName", () => {
  it("returns lunedi for Monday", () => {
    expect(getItalianDayName(new Date("2025-06-16"))).toBe("lunedi");
  });

  it("returns domenica for Sunday", () => {
    expect(getItalianDayName(new Date("2025-06-22"))).toBe("domenica");
  });

  it("returns sabato for Saturday", () => {
    expect(getItalianDayName(new Date("2025-06-21"))).toBe("sabato");
  });
});

describe("getDayLabel", () => {
  it("returns Italian label for day", () => {
    expect(getDayLabel("lunedi")).toBe("Lunedi");
    expect(getDayLabel("domenica")).toBe("Domenica");
  });
});

describe("getOrderedDays", () => {
  it("starts with lunedi and ends with domenica", () => {
    const days = getOrderedDays();
    expect(days[0]).toBe("lunedi");
    expect(days[6]).toBe("domenica");
    expect(days).toHaveLength(7);
  });
});

describe("formatSchedule", () => {
  it("formats single shift", () => {
    expect(
      formatSchedule({ open: "12:00", close: "15:00", open2: null, close2: null }),
    ).toBe("12:00 - 15:00");
  });

  it("formats double shift", () => {
    expect(
      formatSchedule({
        open: "12:00",
        close: "15:00",
        open2: "19:00",
        close2: "23:00",
      }),
    ).toBe("12:00 - 15:00 / 19:00 - 23:00");
  });

  it("returns Chiuso for null schedule", () => {
    expect(formatSchedule(null)).toBe("Chiuso");
  });
});

describe("parseOpeningHours", () => {
  it("parses JSON string into OpeningHours", () => {
    const json = JSON.stringify(FULL_WEEK_HOURS);
    const parsed = parseOpeningHours(json);
    expect(parsed.lunedi?.open).toBe("12:00");
    expect(parsed.domenica?.open2).toBeNull();
  });
});

describe("isUtcDatetimeInFuture", () => {
  it("returns true for future UTC datetime", () => {
    const future = new Date(Date.now() + 3600_000).toISOString().replace("Z", "");
    expect(isUtcDatetimeInFuture(future)).toBe(true);
  });

  it("returns false for past UTC datetime", () => {
    const past = new Date(Date.now() - 3600_000).toISOString().replace("Z", "");
    expect(isUtcDatetimeInFuture(past)).toBe(false);
  });

  it("handles datetime with Z suffix", () => {
    const future = new Date(Date.now() + 3600_000).toISOString();
    expect(isUtcDatetimeInFuture(future)).toBe(true);
  });
});

describe("formatUtcAsItalianTime", () => {
  it("returns HH:MM format", () => {
    const result = formatUtcAsItalianTime("2025-06-18T14:30:00");
    expect(result).toMatch(/^\d{2}:\d{2}$/);
  });
});
