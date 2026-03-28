import type { Db } from "../db/client";
import { restaurants, promotions, events } from "../db/schema";
import { eq, and as dbAnd, lte, gt, gte, or, count } from "drizzle-orm";
import { getTodayISO } from "./date";

export type HomePageData = {
  restaurantCount: number;
  specials: number;
  deals: number;
  newsCount: number;
  todayEvents: number;
  upcomingEvents: number;
};

export async function fetchHomePageData(db: Db): Promise<HomePageData> {
  const today = getTodayISO();

  const [restaurantCountResult, promotionCounts, todayEventResult, upcomingEventResult] = await Promise.all([
    db.select({ count: count() }).from(restaurants).where(eq(restaurants.active, 1)),
    db.select({
      type: promotions.type,
      count: count(),
    })
      .from(promotions)
      .innerJoin(restaurants, eq(restaurants.id, promotions.restaurantId))
      .where(dbAnd(lte(promotions.dateStart, today), gte(promotions.dateEnd, today), eq(restaurants.active, 1)))
      .groupBy(promotions.type),
    db.select({ count: count() }).from(events).where(dbAnd(
      eq(events.active, 1),
      lte(events.dateStart, today),
      or(gte(events.dateEnd, today), eq(events.dateStart, today)),
    )),
    db.select({ count: count() }).from(events).where(dbAnd(eq(events.active, 1), gt(events.dateStart, today))),
  ]);

  const countByType = new Map(promotionCounts.map((r) => [r.type, r.count]));

  return {
    restaurantCount: restaurantCountResult[0]?.count ?? 0,
    specials: countByType.get("special") ?? 0,
    deals: countByType.get("deal") ?? 0,
    newsCount: countByType.get("news") ?? 0,
    todayEvents: todayEventResult[0]?.count ?? 0,
    upcomingEvents: upcomingEventResult[0]?.count ?? 0,
  };
}

export const DAY_NAMES = ["Domenica", "Lunedi", "Martedi", "Mercoledi", "Giovedi", "Venerdi", "Sabato"] as const;
export const MONTH_NAMES = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"] as const;
