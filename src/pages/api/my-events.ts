import type { APIContext } from "astro";
import { events, restaurants, stores } from "../../db/schema";
import { eq, desc, and as dbAnd } from "drizzle-orm";

export async function GET({ locals }: APIContext): Promise<Response> {
  const user = locals.user;
  if (!user) return Response.json({ error: "Non autenticato" }, { status: 401 });

  const db = locals.db;

  const rows = await db
    .select({ event: events, restaurantName: restaurants.name, storeName: stores.name })
    .from(events)
    .leftJoin(restaurants, eq(events.restaurantId, restaurants.id))
    .leftJoin(stores, eq(events.storeId, stores.id))
    .where(dbAnd(eq(events.ownerId, user.id), eq(events.deleted, 0)))
    .orderBy(desc(events.dateStart));

  const userEvents = rows.map(({ event, restaurantName, storeName }) => ({
    ...event,
    restaurantName: restaurantName ?? null,
    storeName: storeName ?? null,
  }));

  return Response.json({ events: userEvents });
}
