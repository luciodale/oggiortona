import type { APIContext } from "astro";
import { restaurants, events } from "../../../../db/schema";
import { eq, and as dbAnd } from "drizzle-orm";
import { requireAdmin } from "../../../../utils/adminGuard";
import { nowItalyFormatted } from "../../../../utils/sqlite";

export async function PUT({ locals, params }: APIContext): Promise<Response> {
  const denied = requireAdmin(locals);
  if (denied) return denied;

  const db = locals.db;
  const id = Number(params.id);

  const [restaurant] = await db.select().from(restaurants).where(eq(restaurants.id, id)).limit(1);
  if (!restaurant) return Response.json({ error: "Non trovato" }, { status: 404 });
  if (restaurant.deleted === 1) return Response.json({ error: "Locale eliminato" }, { status: 404 });

  const newActive = restaurant.active === 1 ? 0 : 1;
  const now = nowItalyFormatted();

  const [updated] = await db.update(restaurants)
    .set({ active: newActive, approved: 1, updatedAt: now })
    .where(eq(restaurants.id, id))
    .returning();

  // Cascade active status to linked events
  if (newActive === 0) {
    await db.update(events).set({ active: 0, updatedAt: now }).where(eq(events.restaurantId, id));
  } else {
    await db.update(events).set({ active: 1, updatedAt: now }).where(dbAnd(eq(events.restaurantId, id), eq(events.deleted, 0)));
  }

  return Response.json({ restaurant: updated });
}
