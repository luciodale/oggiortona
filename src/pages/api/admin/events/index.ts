import type { APIContext } from "astro";
import { events, users, restaurants, stores } from "../../../../db/schema";
import { asc, desc, eq } from "drizzle-orm";
import { requireAdmin } from "../../../../utils/adminGuard";

export async function GET({ locals }: APIContext): Promise<Response> {
  const denied = requireAdmin(locals);
  if (denied) return denied;

  const db = locals.db;

  const rows = await db.select({
    event: events,
    ownerEmail: users.email,
    ownerName: users.name,
    restaurantName: restaurants.name,
    storeName: stores.name,
  })
    .from(events)
    .leftJoin(users, eq(events.ownerId, users.id))
    .leftJoin(restaurants, eq(events.restaurantId, restaurants.id))
    .leftJoin(stores, eq(events.storeId, stores.id))
    .where(eq(events.deleted, 0))
    .orderBy(asc(events.active), desc(events.dateStart));

  const allEvents = rows.map(({ event, ownerEmail, ownerName, restaurantName, storeName }) => ({
    ...event,
    ownerEmail,
    ownerName,
    restaurantName: restaurantName ?? null,
    storeName: storeName ?? null,
  }));

  return Response.json({ events: allEvents });
}
