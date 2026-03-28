import type { APIContext } from "astro";
import { restaurants, promotions } from "../../db/schema";
import { eq, lte, gte, and as dbAnd } from "drizzle-orm";
import { getTodayISO } from "../../utils/date";
import { groupPromotionsByRestaurant, enrichRestaurant } from "../../utils/enrichRestaurant";

export async function GET({ locals }: APIContext): Promise<Response> {
  const user = locals.user;
  if (!user) return Response.json({ error: "Non autenticato" }, { status: 401 });

  const db = locals.db;
  const today = getTodayISO();

  const [userRestaurants, allPromotions] = await Promise.all([
    db.select().from(restaurants).where(eq(restaurants.ownerId, user.id)),
    db.select().from(promotions).where(dbAnd(lte(promotions.dateStart, today), gte(promotions.dateEnd, today))),
  ]);

  const grouped = groupPromotionsByRestaurant(allPromotions);
  const enriched = userRestaurants.map((r) => enrichRestaurant(r, grouped.get(r.id) ?? []));

  return Response.json({ restaurants: enriched });
}
