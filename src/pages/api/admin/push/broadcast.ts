import type { APIContext } from "astro";
import { requireAdmin } from "../../../../utils/adminGuard";
import { broadcastNotification } from "../../../../utils/broadcastNotification";

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
  if (typeof body.title !== "string" || !body.title.trim()) {
    return Response.json({ error: "Titolo mancante" }, { status: 400 });
  }
  if (typeof body.body !== "string" || !body.body.trim()) {
    return Response.json({ error: "Messaggio mancante" }, { status: 400 });
  }

  const env = locals.runtime.env;
  const result = await broadcastNotification(locals.db, env, {
    title: body.title.trim(),
    body: body.body.trim(),
  });

  return Response.json(result);
}
