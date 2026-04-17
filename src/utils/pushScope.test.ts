import { describe, it, expect } from "vitest";
import { isValidScope, canSubscribeToScope, scopesForUser } from "./pushScope";

describe("isValidScope", () => {
  it("returns true for valid scopes", () => {
    expect(isValidScope("admin")).toBe(true);
    expect(isValidScope("owner")).toBe(true);
    expect(isValidScope("general")).toBe(true);
  });

  it("returns false for invalid strings", () => {
    expect(isValidScope("user")).toBe(false);
    expect(isValidScope("")).toBe(false);
    expect(isValidScope("ADMIN")).toBe(false);
  });

  it("returns false for non-string values", () => {
    expect(isValidScope(null)).toBe(false);
    expect(isValidScope(undefined)).toBe(false);
    expect(isValidScope(42)).toBe(false);
    expect(isValidScope({})).toBe(false);
  });
});

describe("canSubscribeToScope", () => {
  it("allows anyone to subscribe to general", () => {
    expect(canSubscribeToScope("general", { isAdmin: false, ownsVenue: false })).toBe(true);
  });

  it("allows only admins to subscribe to admin", () => {
    expect(canSubscribeToScope("admin", { isAdmin: true, ownsVenue: false })).toBe(true);
    expect(canSubscribeToScope("admin", { isAdmin: false, ownsVenue: false })).toBe(false);
  });

  it("allows only restaurant owners to subscribe to owner", () => {
    expect(canSubscribeToScope("owner", { isAdmin: false, ownsVenue: true })).toBe(true);
    expect(canSubscribeToScope("owner", { isAdmin: false, ownsVenue: false })).toBe(false);
  });

  it("admin who owns restaurants can subscribe to all scopes", () => {
    const user = { isAdmin: true, ownsVenue: true };
    expect(canSubscribeToScope("admin", user)).toBe(true);
    expect(canSubscribeToScope("owner", user)).toBe(true);
    expect(canSubscribeToScope("general", user)).toBe(true);
  });
});

describe("scopesForUser", () => {
  it("returns only general for regular user", () => {
    expect(scopesForUser({ isAdmin: false, ownsVenue: false })).toEqual(["general"]);
  });

  it("returns general + owner for restaurant owner", () => {
    expect(scopesForUser({ isAdmin: false, ownsVenue: true })).toEqual(["general", "owner"]);
  });

  it("returns general + admin for admin without restaurants", () => {
    expect(scopesForUser({ isAdmin: true, ownsVenue: false })).toEqual(["general", "admin"]);
  });

  it("returns all scopes for admin who owns restaurants", () => {
    expect(scopesForUser({ isAdmin: true, ownsVenue: true })).toEqual(["general", "owner", "admin"]);
  });
});
