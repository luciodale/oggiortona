import type { APIContext } from "astro";
import { events, restaurants, stores } from "../../../db/schema";
import { eq, and as dbAnd } from "drizzle-orm";
import { updateEventApiSchema } from "../../../schemas/event";
import { nowItalyFormatted } from "../../../utils/sqlite";

export async function GET({ locals, params }: APIContext): Promise<Response> {
  const db = locals.db;
  const id = Number(params.id);

  let [row] = await db
    .select({ event: events, restaurantName: restaurants.name, storeName: stores.name })
    .from(events)
    .leftJoin(restaurants, eq(events.restaurantId, restaurants.id))
    .leftJoin(stores, eq(events.storeId, stores.id))
    .where(dbAnd(eq(events.id, id), eq(events.active, 1), eq(events.deleted, 0)))
    .limit(1);

  if (!row && locals.user) {
    const ownerOrAdmin = locals.isAdmin
      ? eq(events.deleted, 0)
      : dbAnd(eq(events.ownerId, locals.user.id), eq(events.deleted, 0));
    [row] = await db
      .select({ event: events, restaurantName: restaurants.name, storeName: stores.name })
      .from(events)
      .leftJoin(restaurants, eq(events.restaurantId, restaurants.id))
      .leftJoin(stores, eq(events.storeId, stores.id))
      .where(dbAnd(eq(events.id, id), ownerOrAdmin))
      .limit(1);
  }

  if (!row) return Response.json({ error: "Non trovato" }, { status: 404 });

  const { ownerId: _, ...publicEvent } = row.event;

  return Response.json({ event: { ...publicEvent, restaurantName: row.restaurantName ?? null, storeName: row.storeName ?? null } });
}

export async function PUT({ locals, params, request }: APIContext): Promise<Response> {
  const user = locals.user;
  if (!user) return Response.json({ error: "Non autenticato" }, { status: 401 });

  const db = locals.db;
  const id = Number(params.id);

  const [event] = await db.select().from(events).where(eq(events.id, id)).limit(1);
  if (!event) return Response.json({ error: "Non trovato" }, { status: 404 });
  if (event.ownerId !== user.id && !locals.isAdmin) return Response.json({ error: "Non autorizzato" }, { status: 403 });
  if (event.deleted === 1) return Response.json({ error: "Non trovato" }, { status: 404 });

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return Response.json({ error: "Corpo non valido" }, { status: 400 });
  }

  const result = updateEventApiSchema.safeParse(raw);
  if (!result.success) {
    const firstError = result.error.issues[0]?.message ?? "Dati non validi";
    return Response.json({ error: firstError }, { status: 400 });
  }

  const body = result.data;
  const updates: Record<string, unknown> = {};

  if (body.title !== undefined) updates.title = body.title.trim();
  if (body.description !== undefined) updates.description = body.description?.trim() || null;
  if (body.category !== undefined) updates.category = body.category.trim();
  if (body.date_start !== undefined) updates.dateStart = body.date_start;
  if (body.date_end !== undefined) updates.dateEnd = body.date_end || null;
  if (body.time_start !== undefined) updates.timeStart = body.time_start || null;
  if (body.time_end !== undefined) updates.timeEnd = body.time_end || null;
  if (body.address !== undefined) updates.address = body.address.trim();
  if (body.phone !== undefined) updates.phone = body.phone?.trim() || null;
  if (body.latitude !== undefined) updates.latitude = body.latitude;
  if (body.longitude !== undefined) updates.longitude = body.longitude;
  if (body.price !== undefined) updates.price = body.price ?? null;
  if (body.link !== undefined) updates.link = body.link?.trim() || null;
  if (body.restaurant_id !== undefined) updates.restaurantId = body.restaurant_id ?? null;
  if (body.store_id !== undefined) updates.storeId = body.store_id ?? null;

  if (Object.keys(updates).length === 0) {
    return Response.json({ error: "Nessun campo da aggiornare" }, { status: 400 });
  }

  updates.updatedAt = nowItalyFormatted();

  const [updated] = await db.update(events).set(updates).where(eq(events.id, id)).returning();

  return Response.json({ event: updated });
}

export async function DELETE({ locals, params }: APIContext): Promise<Response> {
  const user = locals.user;
  if (!user) return Response.json({ error: "Non autenticato" }, { status: 401 });

  const db = locals.db;
  const id = Number(params.id);

  const [event] = await db.select().from(events).where(eq(events.id, id)).limit(1);
  if (!event) return Response.json({ error: "Non trovato" }, { status: 404 });
  if (event.ownerId !== user.id) return Response.json({ error: "Non autorizzato" }, { status: 403 });

  await db.update(events).set({ deleted: 1, updatedAt: nowItalyFormatted() }).where(eq(events.id, id));

  return Response.json({ message: "Evento rimosso" });
}
