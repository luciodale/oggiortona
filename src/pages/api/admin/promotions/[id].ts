import type { APIContext } from "astro";
import { promotions } from "../../../../db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../../../../utils/adminGuard";

export async function DELETE({ locals, params }: APIContext): Promise<Response> {
  const denied = requireAdmin(locals);
  if (denied) return denied;

  const db = locals.db;
  const id = Number(params.id);

  const [promo] = await db.select().from(promotions).where(eq(promotions.id, id)).limit(1);
  if (!promo) return Response.json({ error: "Non trovato" }, { status: 404 });

  await db.delete(promotions).where(eq(promotions.id, id));

  return Response.json({ ok: true });
}
