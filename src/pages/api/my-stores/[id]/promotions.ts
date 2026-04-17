import type { APIContext } from "astro";
import { stores, storePromotions } from "../../../../db/schema";
import { eq, desc } from "drizzle-orm";
import { getTodayISO } from "../../../../utils/date";
import { computeDateEnd } from "../../../../utils/promotions";
import { buildStoreCooldownSnapshot, insertStoreBump, isStoreCooldownActive } from "../../../../utils/storePromotionCooldown";

const VALID_TYPES = ["generale", "saldi", "deal", "news"] as const;

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

export async function GET({ params, locals }: APIContext) {
  const user = locals.user;
  if (!user) return Response.json({ error: "Non autenticato" }, { status: 401 });

  const storeId = Number(params.id);
  const db = locals.db;

  const [store] = await db
    .select()
    .from(stores)
    .where(eq(stores.id, storeId))
    .limit(1);

  if (!store || store.ownerId !== user.id) {
    return Response.json({ error: "Non autorizzato" }, { status: 403 });
  }

  const [items, cooldown] = await Promise.all([
    db.select().from(storePromotions)
      .where(eq(storePromotions.storeId, storeId))
      .orderBy(desc(storePromotions.createdAt)),
    buildStoreCooldownSnapshot(db, storeId),
  ]);

  return Response.json({
    storeName: store.name,
    items,
    cooldown,
  });
}

export async function POST({ params, locals, request }: APIContext) {
  const user = locals.user;
  if (!user) return Response.json({ error: "Non autenticato" }, { status: 401 });

  const storeId = Number(params.id);
  const db = locals.db;

  const [store] = await db
    .select()
    .from(stores)
    .where(eq(stores.id, storeId))
    .limit(1);

  if (!store || store.ownerId !== user.id) {
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

  if (await isStoreCooldownActive(db, storeId)) {
    const cooldown = await buildStoreCooldownSnapshot(db, storeId);
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

  const price = typeof raw.price === "number" ? raw.price : null;
  const timeStart = typeof raw.timeStart === "string" && raw.timeStart.length <= 5 ? raw.timeStart : null;
  const timeEnd = typeof raw.timeEnd === "string" && raw.timeEnd.length <= 5 ? raw.timeEnd : null;
  const durationDays = typeof raw.durationDays === "number"
    ? Math.min(Math.max(Math.round(raw.durationDays), 1), 7)
    : 1;

  const today = getTodayISO();
  const dateEnd = computeDateEnd(today, durationDays);

  const [created] = await db.insert(storePromotions).values({
    storeId,
    type,
    title,
    description: null,
    price,
    dateStart: today,
    dateEnd,
    timeStart,
    timeEnd,
  }).returning();

  await insertStoreBump(db, storeId, "create");

  return Response.json(created, { status: 201 });
}
