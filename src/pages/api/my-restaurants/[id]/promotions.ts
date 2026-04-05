import type { APIContext } from "astro";
import { restaurants, promotions } from "../../../../db/schema";
import { eq, desc, and as dbAnd, lte, gte, count } from "drizzle-orm";
import type { Db } from "../../../../db/client";
import { getTodayISO } from "../../../../utils/date";
import { computeDateEnd } from "../../../../utils/promotions";

const VALID_TYPES = ["generale", "special", "deal", "news"] as const;
const MAX_ACTIVE = 3;

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

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

export async function GET({ params, locals }: APIContext) {
  const user = locals.user;
  if (!user) return Response.json({ error: "Non autenticato" }, { status: 401 });

  const restaurantId = Number(params.id);
  const db = locals.db;

  const [restaurant] = await db
    .select()
    .from(restaurants)
    .where(eq(restaurants.id, restaurantId))
    .limit(1);

  if (!restaurant || restaurant.ownerId !== user.id) {
    return Response.json({ error: "Non autorizzato" }, { status: 403 });
  }

  const today = getTodayISO();

  const [items, activeCount] = await Promise.all([
    db.select().from(promotions)
      .where(eq(promotions.restaurantId, restaurantId))
      .orderBy(desc(promotions.createdAt))
      .limit(60),
    countActive(db, restaurantId, today),
  ]);

  return Response.json({
    restaurantName: restaurant.name,
    items,
    activeCount,
  });
}

export async function POST({ params, locals, request }: APIContext) {
  const user = locals.user;
  if (!user) return Response.json({ error: "Non autenticato" }, { status: 401 });

  const restaurantId = Number(params.id);
  const db = locals.db;

  const [restaurant] = await db
    .select()
    .from(restaurants)
    .where(eq(restaurants.id, restaurantId))
    .limit(1);

  if (!restaurant || restaurant.ownerId !== user.id) {
    return Response.json({ error: "Non autorizzato" }, { status: 403 });
  }

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
  const today = getTodayISO();

  if (!VALID_TYPES.includes(type as typeof VALID_TYPES[number])) {
    return Response.json({ error: "Tipo non valido" }, { status: 400 });
  }

  const activeCount = await countActive(db, restaurantId, today);
  if (activeCount >= MAX_ACTIVE) {
    return Response.json(
      { error: "Limite raggiunto: massimo 3 pubblicazioni attive", code: "LIMIT_REACHED" },
      { status: 409 },
    );
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
  const durationDays = typeof raw.durationDays === "number"
    ? Math.min(Math.max(Math.round(raw.durationDays), 1), 7)
    : 1;

  const dateEnd = computeDateEnd(today, durationDays);

  const [created] = await db.insert(promotions).values({
    restaurantId,
    type,
    title,
    description: null,
    price,
    dateStart: today,
    dateEnd,
    timeStart,
    timeEnd,
  }).returning();

  return Response.json(created, { status: 201 });
}
