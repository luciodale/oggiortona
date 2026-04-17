import type { APIContext } from "astro";
import { stores, storePromotions, events } from "../../db/schema";
import { eq, lte, gte, lt, or, and as dbAnd, count, sql } from "drizzle-orm";

import { getTodayISO } from "../../utils/date";
import { groupPromotionsByStore, enrichStore } from "../../utils/enrichStore";

export async function GET({ locals }: APIContext): Promise<Response> {
  const user = locals.user;
  if (!user) return Response.json({ error: "Non autenticato" }, { status: 401 });

  const db = locals.db;
  const today = getTodayISO();

  const [userStores, allPromotions, expiredCounts, eventCounts] = await Promise.all([
    db.select().from(stores).where(dbAnd(eq(stores.ownerId, user.id), eq(stores.deleted, 0))),
    db.select().from(storePromotions).where(dbAnd(lte(storePromotions.dateStart, today), gte(storePromotions.dateEnd, today))),
    db.select({ storeId: storePromotions.storeId, count: count() })
      .from(storePromotions)
      .where(lt(storePromotions.dateEnd, today))
      .groupBy(storePromotions.storeId),
    db.select({ storeId: events.storeId, count: sql<number>`count(*)` })
      .from(events)
      .where(dbAnd(
        eq(events.active, 1),
        eq(events.deleted, 0),
        or(gte(events.dateStart, today), gte(events.dateEnd, today)),
      ))
      .groupBy(events.storeId),
  ]);

  const expiredMap = new Map(expiredCounts.map((r) => [r.storeId, r.count]));
  const eventCountMap = new Map(eventCounts.filter((r) => r.storeId != null).map((r) => [r.storeId!, r.count]));
  const grouped = groupPromotionsByStore(allPromotions);
  const enriched = userStores.map((s) =>
    enrichStore(s, grouped.get(s.id) ?? [], expiredMap.get(s.id) ?? 0, eventCountMap.get(s.id) ?? 0),
  );

  return Response.json({ stores: enriched });
}
