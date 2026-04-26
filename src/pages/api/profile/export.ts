import type { APIContext } from "astro";
import { eq } from "drizzle-orm";
import { events, pinnedRestaurants, pinnedStores, pushSubscriptions, restaurants, stores, users } from "../../../db/schema";

// GDPR Art. 20 portability: returns the authenticated user's data as JSON.
export async function GET({ locals }: APIContext): Promise<Response> {
  const user = locals.user;
  if (!user) return Response.json({ error: "Non autenticato" }, { status: 401 });

  const db = locals.db;
  const userId = user.id;

  const [profile, ownedRestaurants, ownedStores, ownedEvents, pinnedR, pinnedS, subscriptions] = await Promise.all([
    db.select().from(users).where(eq(users.id, userId)).limit(1),
    db.select().from(restaurants).where(eq(restaurants.ownerId, userId)),
    db.select().from(stores).where(eq(stores.ownerId, userId)),
    db.select().from(events).where(eq(events.ownerId, userId)),
    db.select().from(pinnedRestaurants).where(eq(pinnedRestaurants.userId, userId)),
    db.select().from(pinnedStores).where(eq(pinnedStores.userId, userId)),
    db.select({ id: pushSubscriptions.id, scope: pushSubscriptions.scope, createdAt: pushSubscriptions.createdAt })
      .from(pushSubscriptions)
      .where(eq(pushSubscriptions.userId, userId)),
  ]);

  const payload = {
    exportedAt: new Date().toISOString(),
    profile: profile[0] ?? null,
    restaurants: ownedRestaurants,
    stores: ownedStores,
    events: ownedEvents,
    pinnedRestaurants: pinnedR,
    pinnedStores: pinnedS,
    pushSubscriptions: subscriptions,
  };

  return new Response(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="oggiortona-data-${userId}.json"`,
    },
  });
}
