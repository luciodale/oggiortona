import type { APIContext } from "astro";
import { pushSubscriptions, restaurants } from "../../../db/schema";
import { eq, and } from "drizzle-orm";
import { scopesForUser } from "../../../utils/pushScope";
import type { PushScope } from "../../../types/domain";

type AutoEnrollBody = {
  endpoint: string;
  keys: { p256dh: string; auth: string };
};

function isValidBody(raw: unknown): raw is AutoEnrollBody {
  if (typeof raw !== "object" || raw === null) return false;
  const obj = raw as Record<string, unknown>;
  if (typeof obj.endpoint !== "string" || !obj.endpoint) return false;
  if (typeof obj.keys !== "object" || obj.keys === null) return false;
  const keys = obj.keys as Record<string, unknown>;
  return typeof keys.p256dh === "string" && typeof keys.auth === "string";
}

export async function POST({ locals, request }: APIContext): Promise<Response> {
  const user = locals.user;
  if (!user) {
    return Response.json({ error: "Non autenticato" }, { status: 401 });
  }

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

  const owned = await db.select({ id: restaurants.id })
    .from(restaurants)
    .where(eq(restaurants.ownerId, user.id))
    .limit(1);

  const scopes = scopesForUser({
    isAdmin: locals.isAdmin,
    ownsRestaurants: owned.length > 0,
  });

  const enrolled: Array<PushScope> = [];

  for (const scope of scopes) {
    await db.delete(pushSubscriptions).where(
      and(eq(pushSubscriptions.endpoint, raw.endpoint), eq(pushSubscriptions.scope, scope)),
    );

    await db.insert(pushSubscriptions).values({
      userId: user.id,
      endpoint: raw.endpoint,
      p256dh: raw.keys.p256dh,
      auth: raw.keys.auth,
      scope,
    });

    enrolled.push(scope);
  }

  return Response.json({ scopes: enrolled }, { status: 201 });
}
