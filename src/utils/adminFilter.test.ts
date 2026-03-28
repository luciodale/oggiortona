import { describe, it, expect } from "vitest";
import { filterBySearch } from "./adminFilter";

const items = [
  { name: "Trattoria Da Mario" },
  { name: "Bar Luna" },
  { name: "Gelateria Polo Nord" },
];

describe("filterBySearch", () => {
  it("returns all items when search is empty", () => {
    expect(filterBySearch(items, "", (i) => i.name)).toHaveLength(3);
  });

  it("returns all items when search is whitespace", () => {
    expect(filterBySearch(items, "   ", (i) => i.name)).toHaveLength(3);
  });

  it("filters by partial match", () => {
    const result = filterBySearch(items, "luna", (i) => i.name);
    expect(result).toHaveLength(1);
    expect(result[0]?.name).toBe("Bar Luna");
  });

  it("is case insensitive", () => {
    const result = filterBySearch(items, "TRATTORIA", (i) => i.name);
    expect(result).toHaveLength(1);
  });

  it("returns empty when no match", () => {
    expect(filterBySearch(items, "pizza", (i) => i.name)).toHaveLength(0);
  });

  it("matches multiple items", () => {
    const result = filterBySearch(items, "a", (i) => i.name);
    expect(result.length).toBeGreaterThan(1);
  });
});
