import type { APIContext } from "astro";
import { restaurants, promotions } from "../../../../../db/schema";
import { eq, sql } from "drizzle-orm";
import { getTodayISO } from "../../../../../utils/date";
import { PROMOTION_DURATION_DAYS, computeDateEnd } from "../../../../../utils/promotions";
import { buildCooldownSnapshot, insertBump, isCooldownActive } from "../../../../../utils/promotionCooldown";

const VALID_TYPES = ["generale", "special", "deal", "news"] as const;

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
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

  if (await isCooldownActive(db, restaurantId)) {
    const cooldown = await buildCooldownSnapshot(db, restaurantId);
    return Response.json(
      {
        error: "Limite raggiunto",
        code: "COOLDOWN_ACTIVE",
        nextSlotAt: cooldown.nextSlotAt,
        remainingMs: cooldown.remainingMs,
      },
      { status: 409 },
    );
  }

  const today = getTodayISO();
  const dateEnd = computeDateEnd(today, PROMOTION_DURATION_DAYS);

  await db.update(promotions)
    .set({ dateStart: today, dateEnd, createdAt: sql`(datetime('now'))` })
    .where(eq(promotions.id, pid));

  await insertBump(db, restaurantId, "renew");

  const [renewed] = await db.select().from(promotions).where(eq(promotions.id, pid)).limit(1);
  if (!renewed) return Response.json({ error: "Non trovato" }, { status: 404 });

  return Response.json(renewed);
}

export async function PATCH({ params, locals, request }: APIContext) {
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

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return Response.json({ error: "Corpo non valido" }, { status: 400 });
  }

  if (!isRecord(raw)) {
    return Response.json({ error: "Dati non validi" }, { status: 400 });
  }

  const type = typeof raw.type === "string" ? raw.type : "";
  if (!VALID_TYPES.includes(type as typeof VALID_TYPES[number])) {
    return Response.json({ error: "Tipo non valido" }, { status: 400 });
  }

  const title = typeof raw.title === "string" ? raw.title.trim() : "";
  if (!title) {
    return Response.json({ error: "Titolo obbligatorio" }, { status: 400 });
  }
  if (title.length > 150) {
    return Response.json({ error: "Titolo troppo lungo (max 150)" }, { status: 400 });
  }

  const price = typeof raw.price === "number" ? raw.price : null;
  const timeStart = typeof raw.timeStart === "string" && raw.timeStart.length <= 5 ? raw.timeStart : null;
  const timeEnd = typeof raw.timeEnd === "string" && raw.timeEnd.length <= 5 ? raw.timeEnd : null;

  await db.update(promotions)
    .set({ type, title, price, timeStart, timeEnd })
    .where(eq(promotions.id, pid));

  const [updated] = await db.select().from(promotions).where(eq(promotions.id, pid)).limit(1);
  if (!updated) return Response.json({ error: "Non trovato" }, { status: 404 });

  return Response.json(updated);
}
