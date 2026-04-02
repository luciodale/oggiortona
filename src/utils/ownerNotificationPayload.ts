type ExpiringPromotion = {
  ownerId: string;
  promotionId: number;
};

type OwnerPayload = {
  userId: string;
  title: string;
  body: string;
  url: string;
};

export function groupByOwner(expiring: ReadonlyArray<ExpiringPromotion>): Map<string, number> {
  const counts = new Map<string, number>();
  for (const row of expiring) {
    counts.set(row.ownerId, (counts.get(row.ownerId) ?? 0) + 1);
  }
  return counts;
}

export function buildOwnerPayload(userId: string, count: number): OwnerPayload {
  const body = count === 1
    ? "Hai 1 promozione in scadenza oggi"
    : `Hai ${count} promozioni in scadenza oggi`;

  return {
    userId,
    title: "Promozione in scadenza",
    body,
    url: "/profile",
  };
}

export function buildOwnerPayloads(expiring: ReadonlyArray<ExpiringPromotion>): Array<OwnerPayload> {
  const counts = groupByOwner(expiring);
  const payloads: Array<OwnerPayload> = [];
  for (const [userId, count] of counts) {
    payloads.push(buildOwnerPayload(userId, count));
  }
  return payloads;
}
