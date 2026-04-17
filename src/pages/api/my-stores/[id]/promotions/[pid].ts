import type { APIContext } from "astro";
import { stores, storePromotions, storePromotionBumps } from "../../../../../db/schema";
import { eq, and as dbAnd, sql } from "drizzle-orm";
import { getTodayISO } from "../../../../../utils/date";
import { PROMOTION_DURATION_DAYS, computeDateEnd } from "../../../../../utils/promotions";
import { buildStoreCooldownSnapshot, isStoreCooldownActive } from "../../../../../utils/storePromotionCooldown";

const VALID_TYPES = ["generale", "saldi", "deal", "news"] as const;
const TIME_REGEX = /^\d{2}:\d{2}$/;

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function parseTime(value: unknown): string | null | "invalid" {
  if (typeof value !== "string" || value.length === 0) return null;
  return TIME_REGEX.test(value) ? value : "invalid";
}

export async function DELETE({ params, locals }: APIContext) {
  const user = locals.user;
  if (!user) return Response.json({ error: "Non autenticato" }, { status: 401 });

  const storeId = Number(params.id);
  const pid = Number(params.pid);
  const db = locals.db;

  const [store] = await db
    .select()
    .from(stores)
    .where(eq(stores.id, storeId))
    .limit(1);

  if (!store || store.ownerId !== user.id) {
    return Response.json({ error: "Non autorizzato" }, { status: 403 });
  }

  const [existing] = await db.select().from(storePromotions).where(dbAnd(eq(storePromotions.id, pid), eq(storePromotions.storeId, storeId))).limit(1);
  if (!existing) return Response.json({ error: "Non trovato" }, { status: 404 });

  await db.delete(storePromotions).where(dbAnd(eq(storePromotions.id, pid), eq(storePromotions.storeId, storeId)));

  return Response.json({ ok: true });
}

export async function PUT({ params, locals }: APIContext) {
  const user = locals.user;
  if (!user) return Response.json({ error: "Non autenticato" }, { status: 401 });

  const storeId = Number(params.id);
  const pid = Number(params.pid);
  const db = locals.db;

  const [store] = await db
    .select()
    .from(stores)
    .where(eq(stores.id, storeId))
    .limit(1);

  if (!store || store.ownerId !== user.id) {
    return Response.json({ error: "Non autorizzato" }, { status: 403 });
  }

  const [existing] = await db.select().from(storePromotions).where(dbAnd(eq(storePromotions.id, pid), eq(storePromotions.storeId, storeId))).limit(1);
  if (!existing) return Response.json({ error: "Non trovato" }, { status: 404 });

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

  const today = getTodayISO();
  const dateEnd = computeDateEnd(today, PROMOTION_DURATION_DAYS);

  await db.batch([
    db.update(storePromotions)
      .set({ dateStart: today, dateEnd, renewedAt: sql`(datetime('now'))` })
      .where(dbAnd(eq(storePromotions.id, pid), eq(storePromotions.storeId, storeId))),
    db.insert(storePromotionBumps).values({ storeId, action: "renew" }),
  ]);

  const [renewed] = await db.select().from(storePromotions).where(dbAnd(eq(storePromotions.id, pid), eq(storePromotions.storeId, storeId))).limit(1);
  if (!renewed) return Response.json({ error: "Non trovato" }, { status: 404 });

  return Response.json(renewed);
}

export async function PATCH({ params, locals, request }: APIContext) {
  const user = locals.user;
  if (!user) return Response.json({ error: "Non autenticato" }, { status: 401 });

  const storeId = Number(params.id);
  const pid = Number(params.pid);
  const db = locals.db;

  const [store] = await db
    .select()
    .from(stores)
    .where(eq(stores.id, storeId))
    .limit(1);

  if (!store || store.ownerId !== user.id) {
    return Response.json({ error: "Non autorizzato" }, { status: 403 });
  }

  const [existing] = await db.select().from(storePromotions).where(dbAnd(eq(storePromotions.id, pid), eq(storePromotions.storeId, storeId))).limit(1);
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

  const price = typeof raw.price === "number" && raw.price >= 0 ? raw.price : null;
  const timeStart = parseTime(raw.timeStart);
  const timeEnd = parseTime(raw.timeEnd);
  if (timeStart === "invalid" || timeEnd === "invalid") {
    return Response.json({ error: "Formato orario non valido" }, { status: 400 });
  }
  if (timeStart && timeEnd && timeEnd < timeStart) {
    return Response.json({ error: "L'orario di fine non può essere precedente a quello di inizio" }, { status: 400 });
  }

  await db.update(storePromotions)
    .set({ type, title, price, timeStart, timeEnd })
    .where(dbAnd(eq(storePromotions.id, pid), eq(storePromotions.storeId, storeId)));

  const [updated] = await db.select().from(storePromotions).where(dbAnd(eq(storePromotions.id, pid), eq(storePromotions.storeId, storeId))).limit(1);
  if (!updated) return Response.json({ error: "Non trovato" }, { status: 404 });

  return Response.json(updated);
}
