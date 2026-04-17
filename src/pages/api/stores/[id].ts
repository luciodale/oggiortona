import type { APIContext } from "astro";
import { stores, storePromotions, events } from "../../../db/schema";
import { eq, and as dbAnd, lte, gte, or, sql } from "drizzle-orm";
import { getTodayISO } from "../../../utils/date";
import { updateStoreApiSchema } from "../../../schemas/store";
import { nowItalyFormatted } from "../../../utils/sqlite";
import { enrichStore } from "../../../utils/enrichStore";

export async function GET({ locals, params }: APIContext): Promise<Response> {
  const db = locals.db;
  const id = Number(params.id);

  let [store] = await db.select().from(stores).where(dbAnd(eq(stores.id, id), eq(stores.active, 1), eq(stores.deleted, 0))).limit(1);

  if (!store && locals.user) {
    const ownerOrAdmin = locals.isAdmin
      ? eq(stores.deleted, 0)
      : dbAnd(eq(stores.ownerId, locals.user.id), eq(stores.deleted, 0));
    [store] = await db.select().from(stores).where(dbAnd(eq(stores.id, id), ownerOrAdmin)).limit(1);
  }

  if (!store) return Response.json({ error: "Non trovato" }, { status: 404 });

  const today = getTodayISO();

  const [activePromotions, [eventCountRow]] = await Promise.all([
    db.select().from(storePromotions).where(
      dbAnd(eq(storePromotions.storeId, id), lte(storePromotions.dateStart, today), gte(storePromotions.dateEnd, today)),
    ).limit(6),
    db.select({ count: sql<number>`count(*)` }).from(events).where(
      dbAnd(eq(events.storeId, id), eq(events.active, 1), eq(events.deleted, 0), or(gte(events.dateStart, today), gte(events.dateEnd, today))),
    ),
  ]);

  const { ownerId: _, ...publicStore } = enrichStore(store, activePromotions, 0, eventCountRow?.count ?? 0);

  return Response.json({ store: publicStore });
}

export async function PUT({ locals, params, request }: APIContext): Promise<Response> {
  const user = locals.user;
  if (!user) return Response.json({ error: "Non autenticato" }, { status: 401 });

  const db = locals.db;
  const id = Number(params.id);

  const [store] = await db.select().from(stores).where(eq(stores.id, id)).limit(1);
  if (!store) return Response.json({ error: "Non trovato" }, { status: 404 });
  if (store.ownerId !== user.id && !locals.isAdmin) return Response.json({ error: "Non autorizzato" }, { status: 403 });
  if (store.deleted === 1) return Response.json({ error: "Non trovato" }, { status: 404 });

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return Response.json({ error: "Corpo non valido" }, { status: 400 });
  }

  const result = updateStoreApiSchema.safeParse(raw);
  if (!result.success) {
    const firstError = result.error.issues[0]?.message ?? "Dati non validi";
    return Response.json({ error: firstError }, { status: 400 });
  }

  const body = result.data;
  const updates: Record<string, unknown> = {};

  if (body.name !== undefined) updates.name = body.name.trim();
  if (body.description !== undefined) updates.description = body.description?.trim() || null;
  if (body.type !== undefined) updates.type = body.type.trim();
  if (body.phone !== undefined) updates.phone = body.phone?.trim() || null;
  if (body.address !== undefined) updates.address = body.address.trim();
  if (body.opening_hours !== undefined) updates.openingHours = body.opening_hours;
  if (body.store_url !== undefined) updates.storeUrl = body.store_url?.trim() || null;
  if (body.latitude !== undefined) updates.latitude = body.latitude;
  if (body.longitude !== undefined) updates.longitude = body.longitude;

  if (Object.keys(updates).length === 0) {
    return Response.json({ error: "Nessun campo da aggiornare" }, { status: 400 });
  }

  updates.updatedAt = nowItalyFormatted();

  const [updated] = await db.update(stores).set(updates).where(eq(stores.id, id)).returning();

  return Response.json({ store: updated });
}

export async function DELETE({ locals, params }: APIContext): Promise<Response> {
  const user = locals.user;
  if (!user) return Response.json({ error: "Non autenticato" }, { status: 401 });

  const db = locals.db;
  const id = Number(params.id);

  const [store] = await db.select().from(stores).where(eq(stores.id, id)).limit(1);
  if (!store) return Response.json({ error: "Non trovato" }, { status: 404 });
  if (store.ownerId !== user.id) return Response.json({ error: "Non autorizzato" }, { status: 403 });

  const now = nowItalyFormatted();
  await db.update(stores).set({ deleted: 1, updatedAt: now }).where(eq(stores.id, id));

  await db.update(events).set({ active: 0, updatedAt: now }).where(eq(events.storeId, id));

  return Response.json({ message: "Negozio rimosso" });
}
