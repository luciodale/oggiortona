import type { APIContext } from "astro";
import { pushSubscriptions } from "../../../db/schema";
import { eq, and } from "drizzle-orm";
import { isValidScope } from "../../../utils/pushScope";

export async function POST({ locals, request }: APIContext): Promise<Response> {
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

  if (!isValidScope(body.scope)) {
    return Response.json({ error: "Scope non valido" }, { status: 400 });
  }

  await locals.db.delete(pushSubscriptions).where(
    and(eq(pushSubscriptions.endpoint, body.endpoint), eq(pushSubscriptions.scope, body.scope)),
  );

  return Response.json({ ok: true });
}
