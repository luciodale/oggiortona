import type { APIContext } from "astro";
import { pushSubscriptions } from "../../../db/schema";
import { eq, and } from "drizzle-orm";
import { isValidScope } from "../../../utils/pushScope";

export async function GET({ locals, url }: APIContext): Promise<Response> {
  if (!locals.user) {
    return Response.json({ error: "Non autenticato" }, { status: 401 });
  }

  const scope = url.searchParams.get("scope");
  if (!isValidScope(scope)) {
    return Response.json({ error: "Scope non valido" }, { status: 400 });
  }

  const existing = await locals.db.select({ id: pushSubscriptions.id })
    .from(pushSubscriptions)
    .where(and(eq(pushSubscriptions.userId, locals.user.id), eq(pushSubscriptions.scope, scope)))
    .limit(1);

  return Response.json({ subscribed: existing.length > 0 });
}
