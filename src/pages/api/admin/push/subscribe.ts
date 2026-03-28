import type { APIContext } from "astro";
import { requireAdmin } from "../../../../utils/adminGuard";
import { pushSubscriptions } from "../../../../db/schema";
import { eq } from "drizzle-orm";

type SubscribeBody = {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
};

function isValidBody(raw: unknown): raw is SubscribeBody {
  if (typeof raw !== "object" || raw === null) return false;
  const obj = raw as Record<string, unknown>;
  if (typeof obj.endpoint !== "string" || !obj.endpoint) return false;
  if (typeof obj.keys !== "object" || obj.keys === null) return false;
  const keys = obj.keys as Record<string, unknown>;
  return typeof keys.p256dh === "string" && typeof keys.auth === "string";
}

export async function POST({ locals, request }: APIContext): Promise<Response> {
  const denied = requireAdmin(locals);
  if (denied) return denied;

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return Response.json({ error: "Corpo non valido" }, { status: 400 });
  }

  if (!isValidBody(raw)) {
    return Response.json({ error: "Dati sottoscrizione non validi" }, { status: 400 });
  }

  const db = locals.db;

  // Upsert: delete existing subscription for this endpoint, then insert
  await db.delete(pushSubscriptions).where(eq(pushSubscriptions.endpoint, raw.endpoint));
  await db.insert(pushSubscriptions).values({
    userId: locals.user!.id,
    endpoint: raw.endpoint,
    p256dh: raw.keys.p256dh,
    auth: raw.keys.auth,
  });

  return Response.json({ ok: true }, { status: 201 });
}
