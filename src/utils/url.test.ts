import { describe, it, expect } from "vitest";
import { parseRedirectUrl } from "./url";

describe("parseRedirectUrl", () => {
  it("returns / when no redirect_url param", () => {
    expect(parseRedirectUrl("")).toBe("/profile");
  });

  it("returns valid path", () => {
    expect(parseRedirectUrl("?redirect_url=/profile")).toBe("/profile");
  });

  it("blocks protocol-relative URLs", () => {
    expect(parseRedirectUrl("?redirect_url=//evil.com")).toBe("/profile");
  });

  it("blocks absolute URLs", () => {
    expect(parseRedirectUrl("?redirect_url=https://evil.com/path")).toBe("/profile");
  });

  it("blocks non-path strings", () => {
    expect(parseRedirectUrl("?redirect_url=javascript:alert(1)")).toBe("/profile");
  });

  it("allows nested paths", () => {
    expect(parseRedirectUrl("?redirect_url=/profile/settings")).toBe("/profile/settings");
  });

  it("allows paths with query strings", () => {
    expect(parseRedirectUrl("?redirect_url=/restaurants?type=bar")).toBe("/restaurants?type=bar");
  });
});
