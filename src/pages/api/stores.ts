import type { APIContext } from "astro";
import { stores, storePromotions, events } from "../../db/schema";
import { eq, and as dbAnd, lte, gte, or, sql } from "drizzle-orm";
import { getTodayISO } from "../../utils/date";
import { createStoreApiSchema } from "../../schemas/store";
import { groupPromotionsByStore, enrichStore } from "../../utils/enrichStore";
import { notifyAdmins } from "../../utils/adminNotify";

export async function GET({ locals }: APIContext): Promise<Response> {
  const db = locals.db;
  const today = getTodayISO();

  const [allStores, allPromotions, eventCounts] = await Promise.all([
    db.select().from(stores).where(dbAnd(eq(stores.active, 1), eq(stores.deleted, 0))),
    db.select().from(storePromotions).where(dbAnd(lte(storePromotions.dateStart, today), gte(storePromotions.dateEnd, today))),
    db.select({ storeId: events.storeId, count: sql<number>`count(*)` })
      .from(events)
      .where(dbAnd(
        eq(events.active, 1),
        eq(events.deleted, 0),
        or(gte(events.dateStart, today), gte(events.dateEnd, today)),
      ))
      .groupBy(events.storeId),
  ]);

  const grouped = groupPromotionsByStore(allPromotions);
  const eventCountMap = new Map(eventCounts.filter((r) => r.storeId != null).map((r) => [r.storeId!, r.count]));
  const enriched = allStores.map((s) => enrichStore(s, grouped.get(s.id) ?? [], 0, eventCountMap.get(s.id) ?? 0));
  const publicList = enriched.map(({ ownerId: _, ...rest }) => rest);

  return Response.json({ stores: publicList, count: publicList.length });
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

  const result = createStoreApiSchema.safeParse(raw);
  if (!result.success) {
    const firstError = result.error.issues[0]?.message ?? "Dati non validi";
    return Response.json({ error: firstError }, { status: 400 });
  }

  const body = result.data;

  const [store] = await db.insert(stores).values({
    name: body.name.trim(),
    description: body.description?.trim() || null,
    type: body.type.trim(),
    phone: body.phone?.trim() || null,
    address: body.address.trim(),
    latitude: body.latitude ?? null,
    longitude: body.longitude ?? null,
    openingHours: body.opening_hours,
    storeUrl: body.store_url?.trim() || null,
    ownerId: user.id,
    active: 0,
    approved: 0,
  }).returning();

  if (!store) {
    return Response.json({ error: "Errore creazione negozio" }, { status: 500 });
  }

  locals.runtime.ctx.waitUntil(
    notifyAdmins(db, locals.runtime.env, {
      title: "Nuovo negozio aggiunto",
      body: `${store.name} (${store.type}) — ${store.address}`,
      url: "/admin",
    }).catch((err) => console.error("[push] notifyAdmins error:", err)),
  );

  const { ownerId: _, ...publicStore } = store;
  return Response.json({ store: publicStore }, { status: 201 });
}
