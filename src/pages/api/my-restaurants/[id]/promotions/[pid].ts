import type { APIContext } from "astro";
import { restaurants, promotions } from "../../../../../db/schema";
import { eq, and as dbAnd, lte, gte, count } from "drizzle-orm";
import type { Db } from "../../../../../db/client";
import { getTodayISO } from "../../../../../utils/date";
import { computeDateEnd, durationFromRange } from "../../../../../utils/promotions";

const MAX_ACTIVE = 3;

async function countActive(db: Db, restaurantId: number, today: string) {
  const [row] = await db
    .select({ count: count() })
    .from(promotions)
    .where(dbAnd(
      eq(promotions.restaurantId, restaurantId),
      lte(promotions.dateStart, today),
      gte(promotions.dateEnd, today),
    ));
  return row?.count ?? 0;
}

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

  const activeCount = await countActive(db, restaurantId, today);
  if (activeCount >= MAX_ACTIVE) {
    return Response.json(
      { error: "Limite raggiunto: massimo 3 pubblicazioni attive", code: "LIMIT_REACHED" },
      { status: 409 },
    );
  }
  const duration = durationFromRange(existing.dateStart, existing.dateEnd);
  const dateEnd = computeDateEnd(today, duration);

  await db.update(promotions).set({ dateStart: today, dateEnd }).where(eq(promotions.id, pid));
  const [renewed] = await db.select().from(promotions).where(eq(promotions.id, pid)).limit(1);
  if (!renewed) return Response.json({ error: "Non trovato" }, { status: 404 });

  return Response.json(renewed);
}
