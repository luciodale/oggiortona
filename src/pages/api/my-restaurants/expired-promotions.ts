import type { APIContext } from "astro";
import { restaurants, promotions } from "../../../db/schema";
import { eq, and as dbAnd, lt } from "drizzle-orm";
import { getTodayISO } from "../../../utils/date";

export async function GET({ locals }: APIContext): Promise<Response> {
  const user = locals.user;
  if (!user) return Response.json({ error: "Non autenticato" }, { status: 401 });

  const db = locals.db;
  const today = getTodayISO();

  const userRestaurants = await db.select({ id: restaurants.id, name: restaurants.name })
    .from(restaurants)
    .where(dbAnd(eq(restaurants.ownerId, user.id), eq(restaurants.active, 1)));

  const restaurantIds = userRestaurants.map((r) => r.id);
  if (restaurantIds.length === 0) {
    return Response.json({ notifications: [] });
  }

  const restaurantNames = new Map(userRestaurants.map((r) => [r.id, r.name]));

  const expiredItems = await db.select().from(promotions)
    .where(lt(promotions.dateEnd, today))
    .limit(30);

  type Notification = {
    kind: "special" | "deal" | "news";
    id: number;
    restaurantId: number;
    restaurantName: string;
    label: string;
    expiredAt: string;
  };

  const notifications: Array<Notification> = [];

  for (const item of expiredItems) {
    if (restaurantIds.includes(item.restaurantId)) {
      notifications.push({
        kind: item.type as "special" | "deal" | "news",
        id: item.id,
        restaurantId: item.restaurantId,
        restaurantName: restaurantNames.get(item.restaurantId) ?? "",
        label: item.title,
        expiredAt: item.dateEnd,
      });
    }
  }

  notifications.sort((a, b) => b.expiredAt.localeCompare(a.expiredAt));

  return Response.json({ notifications: notifications.slice(0, 10) });
}
