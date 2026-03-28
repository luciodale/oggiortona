import type { APIContext } from "astro";
import { events } from "../../../../db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../../../../utils/adminGuard";
import { nowItalyFormatted } from "../../../../utils/sqlite";

export async function PUT({ locals, params }: APIContext): Promise<Response> {
  const denied = requireAdmin(locals);
  if (denied) return denied;

  const db = locals.db;
  const id = Number(params.id);

  const [event] = await db.select().from(events).where(eq(events.id, id)).limit(1);
  if (!event) return Response.json({ error: "Non trovato" }, { status: 404 });

  const newActive = event.active === 1 ? 0 : 1;

  const [updated] = await db.update(events)
    .set({ active: newActive, updatedAt: nowItalyFormatted() })
    .where(eq(events.id, id))
    .returning();

  return Response.json({ event: updated });
}
