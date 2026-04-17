import type { Db } from "../db/client";
import { restaurants, promotions, events, stores, storePromotions } from "../db/schema";
import { eq, and as dbAnd, lte, gt, gte, or, count } from "drizzle-orm";
import { getTodayISO } from "./date";

export type HomePageData = {
  restaurantCount: number;
  generaleCount: number;
  specials: number;
  deals: number;
  newsCount: number;
  todayEvents: number;
  upcomingEvents: number;
  storeCount: number;
  storeGeneraleCount: number;
  saldiCount: number;
  storeDealsCount: number;
  storeNewsCount: number;
};

export async function fetchHomePageData(db: Db): Promise<HomePageData> {
  const today = getTodayISO();

  const [restaurantCountResult, promotionCounts, todayEventResult, upcomingEventResult, storeCountResult, storePromotionCounts] = await Promise.all([
    db.select({ count: count() }).from(restaurants).where(dbAnd(eq(restaurants.active, 1), eq(restaurants.deleted, 0))),
    db.select({
      type: promotions.type,
      count: count(),
    })
      .from(promotions)
      .innerJoin(restaurants, eq(restaurants.id, promotions.restaurantId))
      .where(dbAnd(lte(promotions.dateStart, today), gte(promotions.dateEnd, today), eq(restaurants.active, 1), eq(restaurants.deleted, 0)))
      .groupBy(promotions.type),
    db.select({ count: count() }).from(events).where(dbAnd(
      eq(events.active, 1),
      eq(events.deleted, 0),
      lte(events.dateStart, today),
      or(gte(events.dateEnd, today), eq(events.dateStart, today)),
    )),
    db.select({ count: count() }).from(events).where(dbAnd(eq(events.active, 1), eq(events.deleted, 0), gt(events.dateStart, today))),
    db.select({ count: count() }).from(stores).where(dbAnd(eq(stores.active, 1), eq(stores.deleted, 0))),
    db.select({
      type: storePromotions.type,
      count: count(),
    })
      .from(storePromotions)
      .innerJoin(stores, eq(stores.id, storePromotions.storeId))
      .where(dbAnd(lte(storePromotions.dateStart, today), gte(storePromotions.dateEnd, today), eq(stores.active, 1), eq(stores.deleted, 0)))
      .groupBy(storePromotions.type),
  ]);

  const countByType = new Map(promotionCounts.map((r) => [r.type, r.count]));
  const storeCountByType = new Map(storePromotionCounts.map((r) => [r.type, r.count]));

  return {
    restaurantCount: restaurantCountResult[0]?.count ?? 0,
    generaleCount: countByType.get("generale") ?? 0,
    specials: countByType.get("special") ?? 0,
    deals: countByType.get("deal") ?? 0,
    newsCount: countByType.get("news") ?? 0,
    todayEvents: todayEventResult[0]?.count ?? 0,
    upcomingEvents: upcomingEventResult[0]?.count ?? 0,
    storeCount: storeCountResult[0]?.count ?? 0,
    storeGeneraleCount: storeCountByType.get("generale") ?? 0,
    saldiCount: storeCountByType.get("saldi") ?? 0,
    storeDealsCount: storeCountByType.get("deal") ?? 0,
    storeNewsCount: storeCountByType.get("news") ?? 0,
  };
}

export { DAY_NAMES, MONTH_NAMES_LOWER as MONTH_NAMES } from "../i18n/t";
