import type { APIContext } from "astro";
import { restaurants, promotions } from "../../../../../db/schema";
import { eq } from "drizzle-orm";
import { getTodayISO } from "../../../../../utils/date";
import { computeDateEnd, durationFromRange } from "../../../../../utils/promotions";

export async function DELETE({ params, locals }: APIContext) {
  const user = locals.user;
  if (!user) return Response.json({ error: "Non autenticato" }, { status: 401 });

  const restaurantId = Number(params.id);
  const pid = Number(params.pid);
  const db = locals.db;

  const [restaurant] = await db
    .select()
    .from(restaurants)
    .where(eq(restaurants.id, restaurantId))
    .limit(1);

  if (!restaurant || restaurant.ownerId !== user.id) {
    return Response.json({ error: "Non autorizzato" }, { status: 403 });
  }

  await db.delete(promotions).where(eq(promotions.id, pid));

  return Response.json({ ok: true });
}

export async function PUT({ params, locals }: APIContext) {
  const user = locals.user;
  if (!user) return Response.json({ error: "Non autenticato" }, { status: 401 });

  const restaurantId = Number(params.id);
  const pid = Number(params.pid);
  const db = locals.db;

  const [restaurant] = await db
    .select()
    .from(restaurants)
    .where(eq(restaurants.id, restaurantId))
    .limit(1);

  if (!restaurant || restaurant.ownerId !== user.id) {
    return Response.json({ error: "Non autorizzato" }, { status: 403 });
  }

  const [existing] = await db.select().from(promotions).where(eq(promotions.id, pid)).limit(1);
  if (!existing) return Response.json({ error: "Non trovato" }, { status: 404 });

  const today = getTodayISO();
  const duration = durationFromRange(existing.dateStart, existing.dateEnd);
  const dateEnd = computeDateEnd(today, duration);

  await db.update(promotions).set({ dateStart: today, dateEnd }).where(eq(promotions.id, pid));
  const [renewed] = await db.select().from(promotions).where(eq(promotions.id, pid)).limit(1);
  if (!renewed) return Response.json({ error: "Non trovato" }, { status: 404 });

  return Response.json(renewed);
}
