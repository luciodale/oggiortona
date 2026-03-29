import type { APIContext } from "astro";
import { restaurants, promotions, users } from "../../../../db/schema";
import { asc, lte, gte, eq, and as dbAnd } from "drizzle-orm";
import { getTodayISO } from "../../../../utils/date";
import { requireAdmin } from "../../../../utils/adminGuard";
import { groupPromotionsByRestaurant } from "../../../../utils/enrichRestaurant";

export async function GET({ locals }: APIContext): Promise<Response> {
  const denied = requireAdmin(locals);
  if (denied) return denied;

  const db = locals.db;
  const today = getTodayISO();

  const [allRestaurants, allPromotions] = await Promise.all([
    db.select({
      restaurant: restaurants,
      ownerEmail: users.email,
      ownerName: users.name,
    })
      .from(restaurants)
      .leftJoin(users, eq(restaurants.ownerId, users.id))
      .where(eq(restaurants.deleted, 0))
      .orderBy(asc(restaurants.active), asc(restaurants.name)),
    db.select().from(promotions).where(dbAnd(lte(promotions.dateStart, today), gte(promotions.dateEnd, today))),
  ]);

  const grouped = groupPromotionsByRestaurant(allPromotions);
  const result = allRestaurants.map(({ restaurant: r, ownerEmail, ownerName }) => ({
    ...r,
    ownerEmail,
    ownerName,
    promotions: grouped.get(r.id) ?? [],
  }));

  return Response.json({ restaurants: result });
}
