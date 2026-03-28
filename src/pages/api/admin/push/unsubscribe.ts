import type { APIContext } from "astro";
import { requireAdmin } from "../../../../utils/adminGuard";
import { pushSubscriptions } from "../../../../db/schema";
import { eq } from "drizzle-orm";

export async function POST({ locals, request }: APIContext): Promise<Response> {
  const denied = requireAdmin(locals);
  if (denied) return denied;

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return Response.json({ error: "Corpo non valido" }, { status: 400 });
  }

  const body = raw as Record<string, unknown>;
  if (typeof body.endpoint !== "string" || !body.endpoint) {
    return Response.json({ error: "Endpoint mancante" }, { status: 400 });
  }

  await locals.db.delete(pushSubscriptions).where(eq(pushSubscriptions.endpoint, body.endpoint));

  return Response.json({ ok: true });
}
