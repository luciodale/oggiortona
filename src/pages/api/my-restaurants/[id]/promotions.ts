import type { APIContext } from "astro";
import { restaurants, promotions, promotionBumps } from "../../../../db/schema";
import { eq, desc } from "drizzle-orm";
import { getTodayISO } from "../../../../utils/date";
import { PROMOTION_DURATION_DAYS, computeDateEnd } from "../../../../utils/promotions";
import { buildCooldownSnapshot, isCooldownActive } from "../../../../utils/promotionCooldown";

const VALID_TYPES = ["generale", "special", "deal", "news"] as const;
const TIME_REGEX = /^\d{2}:\d{2}$/;

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function parseTime(value: unknown): string | null | "invalid" {
  if (typeof value !== "string" || value.length === 0) return null;
  return TIME_REGEX.test(value) ? value : "invalid";
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

  const [items, cooldown] = await Promise.all([
    db.select().from(promotions)
      .where(eq(promotions.restaurantId, restaurantId))
      .orderBy(desc(promotions.createdAt)),
    buildCooldownSnapshot(db, restaurantId),
  ]);

  return Response.json({
    restaurantName: restaurant.name,
    items,
    cooldown,
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

  if (!VALID_TYPES.includes(type as typeof VALID_TYPES[number])) {
    return Response.json({ error: "Tipo non valido" }, { status: 400 });
  }

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

  const title = typeof raw.title === "string" ? raw.title.trim() : "";
  if (!title) {
    return Response.json({ error: "Titolo obbligatorio" }, { status: 400 });
  }
  if (title.length > 150) {
    return Response.json({ error: "Titolo troppo lungo (max 150)" }, { status: 400 });
  }

  const price = typeof raw.price === "number" && raw.price >= 0 ? raw.price : null;
  const timeStart = parseTime(raw.timeStart);
  const timeEnd = parseTime(raw.timeEnd);
  if (timeStart === "invalid" || timeEnd === "invalid") {
    return Response.json({ error: "Formato orario non valido" }, { status: 400 });
  }
  if (timeStart && timeEnd && timeEnd < timeStart) {
    return Response.json({ error: "L'orario di fine non può essere precedente a quello di inizio" }, { status: 400 });
  }

  const today = getTodayISO();
  const dateEnd = computeDateEnd(today, PROMOTION_DURATION_DAYS);

  const [createdRows] = await db.batch([
    db.insert(promotions).values({
      restaurantId,
      type,
      title,
      description: null,
      price,
      dateStart: today,
      dateEnd,
      timeStart,
      timeEnd,
    }).returning(),
    db.insert(promotionBumps).values({ restaurantId, action: "create" }),
  ]);

  return Response.json(createdRows[0], { status: 201 });
}
