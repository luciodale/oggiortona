import type { APIContext } from "astro";
import { restaurants, promotions, events } from "../../../db/schema";
import { eq, and as dbAnd, lte, gte, or, sql } from "drizzle-orm";
import { getTodayISO } from "../../../utils/date";
import { updateRestaurantApiSchema } from "../../../schemas/restaurant";
import { nowItalyFormatted } from "../../../utils/sqlite";
import { enrichRestaurant } from "../../../utils/enrichRestaurant";

export async function GET({ locals, params }: APIContext): Promise<Response> {
  const db = locals.db;
  const id = Number(params.id);

  let [restaurant] = await db.select().from(restaurants).where(dbAnd(eq(restaurants.id, id), eq(restaurants.active, 1), eq(restaurants.deleted, 0))).limit(1);

  if (!restaurant && locals.user) {
    const ownerOrAdmin = locals.isAdmin
      ? eq(restaurants.deleted, 0)
      : dbAnd(eq(restaurants.ownerId, locals.user.id), eq(restaurants.deleted, 0));
    [restaurant] = await db.select().from(restaurants).where(dbAnd(eq(restaurants.id, id), ownerOrAdmin)).limit(1);
  }

  if (!restaurant) return Response.json({ error: "Non trovato" }, { status: 404 });

  const today = getTodayISO();

  const [activePromotions, [eventCountRow]] = await Promise.all([
    db.select().from(promotions).where(
      dbAnd(eq(promotions.restaurantId, id), lte(promotions.dateStart, today), gte(promotions.dateEnd, today)),
    ).limit(6),
    db.select({ count: sql<number>`count(*)` }).from(events).where(
      dbAnd(eq(events.restaurantId, id), eq(events.active, 1), eq(events.deleted, 0), or(gte(events.dateStart, today), gte(events.dateEnd, today))),
    ),
  ]);

  const { ownerId: _, ...publicRestaurant } = enrichRestaurant(restaurant, activePromotions, 0, eventCountRow?.count ?? 0);

  return Response.json({ restaurant: publicRestaurant });
}

export async function PUT({ locals, params, request }: APIContext): Promise<Response> {
  const user = locals.user;
  if (!user) return Response.json({ error: "Non autenticato" }, { status: 401 });

  const db = locals.db;
  const id = Number(params.id);

  const [restaurant] = await db.select().from(restaurants).where(eq(restaurants.id, id)).limit(1);
  if (!restaurant) return Response.json({ error: "Non trovato" }, { status: 404 });
  if (restaurant.ownerId !== user.id && !locals.isAdmin) return Response.json({ error: "Non autorizzato" }, { status: 403 });
  if (restaurant.deleted === 1) return Response.json({ error: "Non trovato" }, { status: 404 });

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return Response.json({ error: "Corpo non valido" }, { status: 400 });
  }

  const result = updateRestaurantApiSchema.safeParse(raw);
  if (!result.success) {
    const firstError = result.error.issues[0]?.message ?? "Dati non validi";
    return Response.json({ error: firstError }, { status: 400 });
  }

  const body = result.data;
  const updates: Record<string, unknown> = {};

  if (body.name !== undefined) updates.name = body.name.trim();
  if (body.description !== undefined) updates.description = body.description?.trim() || null;
  if (body.type !== undefined) updates.type = body.type.trim();
  if (body.price_range !== undefined) updates.priceRange = body.price_range;
  if (body.phone !== undefined) updates.phone = body.phone?.trim() || null;
  if (body.address !== undefined) updates.address = body.address.trim();
  if (body.opening_hours !== undefined) updates.openingHours = body.opening_hours;
  if (body.menu_url !== undefined) updates.menuUrl = body.menu_url?.trim() || null;
  if (body.latitude !== undefined) updates.latitude = body.latitude;
  if (body.longitude !== undefined) updates.longitude = body.longitude;

  if (Object.keys(updates).length === 0) {
    return Response.json({ error: "Nessun campo da aggiornare" }, { status: 400 });
  }

  updates.updatedAt = nowItalyFormatted();

  const [updated] = await db.update(restaurants).set(updates).where(eq(restaurants.id, id)).returning();

  return Response.json({ restaurant: updated });
}

export async function DELETE({ locals, params }: APIContext): Promise<Response> {
  const user = locals.user;
  if (!user) return Response.json({ error: "Non autenticato" }, { status: 401 });

  const db = locals.db;
  const id = Number(params.id);

  const [restaurant] = await db.select().from(restaurants).where(eq(restaurants.id, id)).limit(1);
  if (!restaurant) return Response.json({ error: "Non trovato" }, { status: 404 });
  if (restaurant.ownerId !== user.id) return Response.json({ error: "Non autorizzato" }, { status: 403 });

  const now = nowItalyFormatted();
  await db.update(restaurants).set({ deleted: 1, updatedAt: now }).where(eq(restaurants.id, id));

  // Disable linked events when restaurant is deleted
  await db.update(events).set({ active: 0, updatedAt: now }).where(eq(events.restaurantId, id));

  return Response.json({ message: "Locale rimosso" });
}
