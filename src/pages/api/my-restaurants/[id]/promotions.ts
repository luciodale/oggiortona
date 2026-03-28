import type { APIContext } from "astro";
import { restaurants, promotions } from "../../../../db/schema";
import { eq, desc } from "drizzle-orm";
import { getTodayISO } from "../../../../utils/date";
import { computeDateEnd } from "../../../../utils/promotions";

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
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

  const items = await db.select().from(promotions)
    .where(eq(promotions.restaurantId, restaurantId))
    .orderBy(desc(promotions.createdAt))
    .limit(60);

  return Response.json({
    restaurantName: restaurant.name,
    items,
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

  if (type !== "special" && type !== "deal" && type !== "news") {
    return Response.json({ error: "Tipo non valido" }, { status: 400 });
  }

  let title: string;
  let description: string | null = null;
  let price: number | null = null;

  switch (type) {
    case "special": {
      const desc = typeof raw.description === "string" ? raw.description.trim() : "";
      if (!desc) {
        return Response.json({ error: "Descrizione obbligatoria" }, { status: 400 });
      }
      if (desc.length > 200) {
        return Response.json({ error: "Descrizione troppo lunga (max 200)" }, { status: 400 });
      }
      title = desc;
      price = typeof raw.price === "number" ? raw.price : null;
      break;
    }
    case "deal":
    case "news": {
      const t = typeof raw.title === "string" ? raw.title.trim() : "";
      if (!t) {
        return Response.json({ error: "Titolo obbligatorio" }, { status: 400 });
      }
      if (t.length > 100) {
        return Response.json({ error: "Titolo troppo lungo (max 100)" }, { status: 400 });
      }
      title = t;
      const d = typeof raw.description === "string" ? raw.description.trim() || null : null;
      if (d && d.length > 300) {
        return Response.json({ error: "Descrizione troppo lunga (max 300)" }, { status: 400 });
      }
      description = d;
      price = typeof raw.price === "number" ? raw.price : null;
      break;
    }
  }

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
    description,
    price,
    dateStart: today,
    dateEnd,
    timeStart,
    timeEnd,
  }).returning();

  return Response.json(created, { status: 201 });
}
