import type { APIContext } from "astro";
import { stores, events } from "../../../../db/schema";
import { eq, and as dbAnd } from "drizzle-orm";
import { requireAdmin } from "../../../../utils/adminGuard";
import { nowItalyFormatted } from "../../../../utils/sqlite";
import { notifyOwner } from "../../../../utils/notifyOwner";

export async function PUT({ locals, params }: APIContext): Promise<Response> {
  const denied = requireAdmin(locals);
  if (denied) return denied;

  const db = locals.db;
  const id = Number(params.id);

  const [store] = await db.select().from(stores).where(eq(stores.id, id)).limit(1);
  if (!store) return Response.json({ error: "Non trovato" }, { status: 404 });
  if (store.deleted === 1) return Response.json({ error: "Negozio eliminato" }, { status: 404 });

  const wasPending = store.approved === 0;
  const newActive = store.active === 1 ? 0 : 1;
  const now = nowItalyFormatted();

  const [updated] = await db.update(stores)
    .set({ active: newActive, approved: 1, updatedAt: now })
    .where(eq(stores.id, id))
    .returning();

  if (newActive === 0) {
    await db.update(events).set({ active: 0, updatedAt: now }).where(eq(events.storeId, id));
  } else {
    await db.update(events).set({ active: 1, updatedAt: now }).where(dbAnd(eq(events.storeId, id), eq(events.deleted, 0)));
  }

  if (wasPending && newActive === 1) {
    locals.runtime.ctx.waitUntil(
      notifyOwner(db, locals.runtime.env, store.ownerId, {
        title: "Negozio approvato",
        body: `Il tuo negozio "${store.name}" è stato approvato ed è ora visibile.`,
        url: "/profile",
      }).catch((err) => console.error("[push] notifyOwner error:", err)),
    );
  }

  return Response.json({ store: updated });
}
