import type { APIContext } from "astro";
import { clerkClient } from "@clerk/astro/server";
import { and, eq, inArray, or, sql } from "drizzle-orm";
import { events, restaurants, stores, users } from "../../db/schema";
import { getTodayISO } from "../../utils/date";

const DELETED_USER_ID = "deleted-user";

// Account deletion strategy:
// - Restaurants + stores are long-lived listings that need an active owner
//   to keep hours / phone / menu fresh. Hard-delete; cascades clean up
//   promotions, bumps, pins.
// - Past events the user posted at one of their own venues → delete
//   (no venue, no point keeping the historical record).
// - Other past events the user posted → anonymise to "deleted-user".
// - Future events the user posted → delete (same staleness problem).
// - Then drop the user row (cascades push subs + remaining pins) and the
//   Clerk identity. Whole D1 side runs in a single batch for atomicity.
export async function DELETE(context: APIContext): Promise<Response> {
  const user = context.locals.user;
  if (!user) return Response.json({ error: "Non autenticato" }, { status: 401 });

  const db = context.locals.db;
  const userId = user.id;
  const today = getTodayISO();

  // Snapshot business IDs so we can target their linked events inside the
  // batch — once the batch deletes the businesses, the IDs are gone.
  const [ownedRestaurants, ownedStores] = await Promise.all([
    db.select({ id: restaurants.id }).from(restaurants).where(eq(restaurants.ownerId, userId)),
    db.select({ id: stores.id }).from(stores).where(eq(stores.ownerId, userId)),
  ]);
  const restaurantIds = ownedRestaurants.map((r) => r.id);
  const storeIds = ownedStores.map((s) => s.id);

  const effectiveDate = sql`COALESCE(${events.dateEnd}, ${events.dateStart})`;

  const linkedPredicates = [
    restaurantIds.length > 0 ? inArray(events.restaurantId, restaurantIds) : undefined,
    storeIds.length > 0 ? inArray(events.storeId, storeIds) : undefined,
  ].filter((p): p is NonNullable<typeof p> => p !== undefined);
  const linkedToOwnBusiness = linkedPredicates.length > 0 ? or(...linkedPredicates) : sql`0`;

  await db.batch([
    db
      .insert(users)
      .values({ id: DELETED_USER_ID, email: null, name: null, avatarUrl: null })
      .onConflictDoNothing(),

    // Delete: future-mine OR past-mine-at-my-venue.
    db.delete(events).where(
      and(
        eq(events.ownerId, userId),
        or(sql`${effectiveDate} >= ${today}`, linkedToOwnBusiness),
      ),
    ),

    // Anonymise the survivors (past, not at my venue).
    db
      .update(events)
      .set({ ownerId: DELETED_USER_ID })
      .where(and(eq(events.ownerId, userId), sql`${effectiveDate} < ${today}`)),

    db.delete(restaurants).where(eq(restaurants.ownerId, userId)),
    db.delete(stores).where(eq(stores.ownerId, userId)),
    db.delete(users).where(eq(users.id, userId)),
  ]);

  try {
    const clerk = clerkClient(context);
    await clerk.users.deleteUser(userId);
  } catch (err) {
    console.error("[profile] Failed to delete Clerk user:", err instanceof Error ? err.message : err);
    // D1 deletion already succeeded; user is functionally gone from our side.
    return Response.json({ ok: true, clerkDeleted: false }, { status: 200 });
  }

  return Response.json({ ok: true, clerkDeleted: true }, { status: 200 });
}
