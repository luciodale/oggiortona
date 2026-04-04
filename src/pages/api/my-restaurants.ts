import type { APIContext } from "astro";
import { restaurants, promotions, events } from "../../db/schema";
import { eq, lte, gte, lt, or, and as dbAnd, count, sql } from "drizzle-orm";

import { getTodayISO } from "../../utils/date";
import { groupPromotionsByRestaurant, enrichRestaurant } from "../../utils/enrichRestaurant";

export async function GET({ locals }: APIContext): Promise<Response> {
  const user = locals.user;
  if (!user) return Response.json({ error: "Non autenticato" }, { status: 401 });

  const db = locals.db;
  const today = getTodayISO();

  const [userRestaurants, allPromotions, expiredCounts, eventCounts] = await Promise.all([
    db.select().from(restaurants).where(dbAnd(eq(restaurants.ownerId, user.id), eq(restaurants.deleted, 0))),
    db.select().from(promotions).where(dbAnd(lte(promotions.dateStart, today), gte(promotions.dateEnd, today))),
    db.select({ restaurantId: promotions.restaurantId, count: count() })
      .from(promotions)
      .where(lt(promotions.dateEnd, today))
      .groupBy(promotions.restaurantId),
    db.select({ restaurantId: events.restaurantId, count: sql<number>`count(*)` })
      .from(events)
      .where(dbAnd(
        eq(events.active, 1),
        eq(events.deleted, 0),
        or(gte(events.dateStart, today), gte(events.dateEnd, today)),
      ))
      .groupBy(events.restaurantId),
  ]);

  const expiredMap = new Map(expiredCounts.map((r) => [r.restaurantId, r.count]));
  const eventCountMap = new Map(eventCounts.filter((r) => r.restaurantId != null).map((r) => [r.restaurantId!, r.count]));
  const grouped = groupPromotionsByRestaurant(allPromotions);
  const enriched = userRestaurants.map((r) =>
    enrichRestaurant(r, grouped.get(r.id) ?? [], expiredMap.get(r.id) ?? 0, eventCountMap.get(r.id) ?? 0),
  );

  return Response.json({ restaurants: enriched });
}
