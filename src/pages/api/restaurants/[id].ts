import type { APIContext } from "astro";
import { restaurants, promotions } from "../../../db/schema";
import { eq, and as dbAnd, lte, gte } from "drizzle-orm";
import { getTodayISO } from "../../../utils/date";
import { updateRestaurantApiSchema } from "../../../schemas/restaurant";
import { nowItalyFormatted } from "../../../utils/sqlite";
import { enrichRestaurant } from "../../../utils/enrichRestaurant";

export async function GET({ locals, params }: APIContext): Promise<Response> {
  const db = locals.db;
  const id = Number(params.id);

  let [restaurant] = await db.select().from(restaurants).where(dbAnd(eq(restaurants.id, id), eq(restaurants.active, 1))).limit(1);

  if (!restaurant && locals.user) {
    [restaurant] = await db.select().from(restaurants).where(dbAnd(eq(restaurants.id, id), eq(restaurants.ownerId, locals.user.id))).limit(1);
  }

  if (!restaurant) return Response.json({ error: "Non trovato" }, { status: 404 });

  const today = getTodayISO();

  const activePromotions = await db.select().from(promotions).where(
    dbAnd(eq(promotions.restaurantId, id), lte(promotions.dateStart, today), gte(promotions.dateEnd, today)),
  ).limit(6);

  const { ownerId: _, ...publicRestaurant } = enrichRestaurant(restaurant, activePromotions);

  return Response.json({ restaurant: publicRestaurant });
}

export async function PUT({ locals, params, request }: APIContext): Promise<Response> {
  const user = locals.user;
  if (!user) return Response.json({ error: "Non autenticato" }, { status: 401 });

  const db = locals.db;
  const id = Number(params.id);

  const [restaurant] = await db.select().from(restaurants).where(eq(restaurants.id, id)).limit(1);
  if (!restaurant) return Response.json({ error: "Non trovato" }, { status: 404 });
  if (restaurant.ownerId !== user.id) return Response.json({ error: "Non autorizzato" }, { status: 403 });

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

  await db.update(restaurants).set({ active: 0, updatedAt: new Date().toISOString() }).where(eq(restaurants.id, id));

  return Response.json({ message: "Locale rimosso" });
}
