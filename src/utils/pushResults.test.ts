import { describe, it, expect } from "vitest";
import { extractStaleEndpoints } from "./pushResults";

function fulfilled(success: boolean, status: number): PromiseSettledResult<{ success: boolean; status: number }> {
  return { status: "fulfilled", value: { success, status } };
}

function rejected(reason: string): PromiseSettledResult<{ success: boolean; status: number }> {
  return { status: "rejected", reason };
}

describe("extractStaleEndpoints", () => {
  it("returns empty array when all succeed", () => {
    const endpoints = ["https://push.example.com/a", "https://push.example.com/b"];
    const results = [fulfilled(true, 201), fulfilled(true, 201)];
    expect(extractStaleEndpoints(endpoints, results)).toEqual([]);
  });

  it("extracts 410 Gone endpoints", () => {
    const endpoints = ["https://push.example.com/a", "https://push.example.com/b"];
    const results = [fulfilled(true, 201), fulfilled(false, 410)];
    expect(extractStaleEndpoints(endpoints, results)).toEqual(["https://push.example.com/b"]);
  });

  it("extracts 404 Not Found endpoints", () => {
    const endpoints = ["https://push.example.com/a"];
    const results = [fulfilled(false, 404)];
    expect(extractStaleEndpoints(endpoints, results)).toEqual(["https://push.example.com/a"]);
  });

  it("ignores other failure statuses", () => {
    const endpoints = ["https://push.example.com/a"];
    const results = [fulfilled(false, 429)];
    expect(extractStaleEndpoints(endpoints, results)).toEqual([]);
  });

  it("ignores rejected promises", () => {
    const endpoints = ["https://push.example.com/a"];
    const results = [rejected("network error")];
    expect(extractStaleEndpoints(endpoints, results)).toEqual([]);
  });

  it("handles mixed results", () => {
    const endpoints = [
      "https://push.example.com/a",
      "https://push.example.com/b",
      "https://push.example.com/c",
      "https://push.example.com/d",
    ];
    const results = [
      fulfilled(true, 201),
      fulfilled(false, 410),
      rejected("timeout"),
      fulfilled(false, 404),
    ];
    expect(extractStaleEndpoints(endpoints, results)).toEqual([
      "https://push.example.com/b",
      "https://push.example.com/d",
    ]);
  });

  it("returns empty for empty inputs", () => {
    expect(extractStaleEndpoints([], [])).toEqual([]);
  });
});
