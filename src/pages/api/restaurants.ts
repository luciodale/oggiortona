import type { APIContext } from "astro";
import { restaurants, promotions } from "../../db/schema";
import { eq, and as dbAnd, lte, gte } from "drizzle-orm";
import { getTodayISO } from "../../utils/date";
import { createRestaurantApiSchema } from "../../schemas/restaurant";
import { groupPromotionsByRestaurant, enrichRestaurant } from "../../utils/enrichRestaurant";
import { notifyAdmins } from "../../utils/adminNotify";

export async function GET({ locals }: APIContext): Promise<Response> {
  const db = locals.db;
  const today = getTodayISO();

  const [allRestaurants, allPromotions] = await Promise.all([
    db.select().from(restaurants).where(dbAnd(eq(restaurants.active, 1), eq(restaurants.deleted, 0))),
    db.select().from(promotions).where(dbAnd(lte(promotions.dateStart, today), gte(promotions.dateEnd, today))),
  ]);

  const grouped = groupPromotionsByRestaurant(allPromotions);
  const enriched = allRestaurants.map((r) => enrichRestaurant(r, grouped.get(r.id) ?? []));
  const publicList = enriched.map(({ ownerId: _, ...rest }) => rest);

  return Response.json({ restaurants: publicList, count: publicList.length });
}

export async function POST({ locals, request }: APIContext): Promise<Response> {
  const user = locals.user;
  if (!user) return Response.json({ error: "Non autenticato" }, { status: 401 });

  const db = locals.db;

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return Response.json({ error: "Corpo non valido" }, { status: 400 });
  }

  const result = createRestaurantApiSchema.safeParse(raw);
  if (!result.success) {
    const firstError = result.error.issues[0]?.message ?? "Dati non validi";
    return Response.json({ error: firstError }, { status: 400 });
  }

  const body = result.data;

  const [restaurant] = await db.insert(restaurants).values({
    name: body.name.trim(),
    description: body.description?.trim() || null,
    type: body.type.trim(),
    priceRange: body.price_range,
    phone: body.phone?.trim() || null,
    address: body.address.trim(),
    latitude: body.latitude ?? null,
    longitude: body.longitude ?? null,
    openingHours: body.opening_hours,
    menuUrl: body.menu_url?.trim() || null,
    ownerId: user.id,
    active: 0,
    approved: 0,
  }).returning();

  if (!restaurant) {
    return Response.json({ error: "Errore creazione locale" }, { status: 500 });
  }

  // Notify admins — use waitUntil so the worker stays alive until the push is sent
  locals.runtime.ctx.waitUntil(
    notifyAdmins(db, locals.runtime.env, {
      title: "Nuovo ristorante aggiunto",
      body: `${restaurant.name} (${restaurant.type}) — ${restaurant.address}`,
      url: "/admin",
    }).catch((err) => console.error("[push] notifyAdmins error:", err)),
  );

  const { ownerId: _, ...publicRestaurant } = restaurant;
  return Response.json({ restaurant: publicRestaurant }, { status: 201 });
}
