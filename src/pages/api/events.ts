import type { APIContext } from "astro";
import { events } from "../../db/schema";
import { createEventApiSchema } from "../../schemas/event";
import { notifyAdmins } from "../../utils/adminNotify";

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

  const result = createEventApiSchema.safeParse(raw);
  if (!result.success) {
    const firstError = result.error.issues[0]?.message ?? "Dati non validi";
    return Response.json({ error: firstError }, { status: 400 });
  }

  const body = result.data;

  const [event] = await db.insert(events).values({
    title: body.title.trim(),
    description: body.description?.trim() || null,
    category: body.category.trim(),
    dateStart: body.date_start,
    dateEnd: body.date_end || null,
    timeStart: body.time_start || null,
    timeEnd: body.time_end || null,
    address: body.address.trim(),
    phone: body.phone?.trim() || null,
    latitude: body.latitude ?? null,
    longitude: body.longitude ?? null,
    price: body.price ?? null,
    ownerId: user.id,
    active: 1,
  }).returning();

  if (!event) {
    return Response.json({ error: "Errore creazione evento" }, { status: 500 });
  }

  // Notify admins — use waitUntil so the worker stays alive until the push is sent
  const datePart = event.dateEnd
    ? `${event.dateStart} — ${event.dateEnd}`
    : event.dateStart;
  locals.runtime.ctx.waitUntil(
    notifyAdmins(locals.db, locals.runtime.env, {
      title: "Nuovo evento aggiunto",
      body: `${event.title} (${event.category}) — ${event.address}, ${datePart}`,
      url: "/admin",
    }).catch((err) => console.error("[push] notifyAdmins error:", err)),
  );

  const { ownerId: _, ...publicEvent } = event;
  return Response.json({ event: publicEvent }, { status: 201 });
}
