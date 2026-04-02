import { describe, it, expect } from "vitest";
import { groupByOwner, buildOwnerPayload, buildOwnerPayloads } from "./ownerNotificationPayload";

describe("groupByOwner", () => {
  it("returns empty map for no promotions", () => {
    expect(groupByOwner([])).toEqual(new Map());
  });

  it("counts single promotion per owner", () => {
    const result = groupByOwner([
      { ownerId: "u1", promotionId: 1 },
    ]);
    expect(result.get("u1")).toBe(1);
  });

  it("groups multiple promotions by same owner", () => {
    const result = groupByOwner([
      { ownerId: "u1", promotionId: 1 },
      { ownerId: "u1", promotionId: 2 },
      { ownerId: "u1", promotionId: 3 },
    ]);
    expect(result.get("u1")).toBe(3);
    expect(result.size).toBe(1);
  });

  it("groups promotions across different owners", () => {
    const result = groupByOwner([
      { ownerId: "u1", promotionId: 1 },
      { ownerId: "u2", promotionId: 2 },
      { ownerId: "u1", promotionId: 3 },
      { ownerId: "u3", promotionId: 4 },
      { ownerId: "u2", promotionId: 5 },
    ]);
    expect(result.get("u1")).toBe(2);
    expect(result.get("u2")).toBe(2);
    expect(result.get("u3")).toBe(1);
    expect(result.size).toBe(3);
  });
});

describe("buildOwnerPayload", () => {
  it("uses singular form for 1 promotion", () => {
    const payload = buildOwnerPayload("u1", 1);
    expect(payload.body).toBe("Hai 1 promozione in scadenza oggi");
    expect(payload.title).toBe("Promozione in scadenza");
    expect(payload.url).toBe("/profile");
    expect(payload.userId).toBe("u1");
  });

  it("uses plural form for 2 promotions", () => {
    const payload = buildOwnerPayload("u1", 2);
    expect(payload.body).toBe("Hai 2 promozioni in scadenza oggi");
  });

  it("uses plural form for large counts", () => {
    const payload = buildOwnerPayload("u1", 15);
    expect(payload.body).toBe("Hai 15 promozioni in scadenza oggi");
  });
});

describe("buildOwnerPayloads", () => {
  it("returns empty array for no promotions", () => {
    expect(buildOwnerPayloads([])).toEqual([]);
  });

  it("builds one payload per owner", () => {
    const payloads = buildOwnerPayloads([
      { ownerId: "u1", promotionId: 1 },
      { ownerId: "u2", promotionId: 2 },
      { ownerId: "u1", promotionId: 3 },
    ]);
    expect(payloads).toHaveLength(2);

    const u1 = payloads.find((p) => p.userId === "u1");
    const u2 = payloads.find((p) => p.userId === "u2");
    expect(u1?.body).toBe("Hai 2 promozioni in scadenza oggi");
    expect(u2?.body).toBe("Hai 1 promozione in scadenza oggi");
  });
});
