import type { APIContext } from "astro";
import { pinnedRestaurants } from "../../db/schema";
import { eq, and } from "drizzle-orm";

function isValidPinBody(raw: unknown): raw is { restaurantId: number } {
  if (typeof raw !== "object" || raw === null) return false;
  const obj = raw as Record<string, unknown>;
  return typeof obj.restaurantId === "number" && Number.isInteger(obj.restaurantId);
}

export async function GET({ locals }: APIContext): Promise<Response> {
  const user = locals.user;
  if (!user) return Response.json({ error: "Non autenticato" }, { status: 401 });

  const rows = await locals.db
    .select({ restaurantId: pinnedRestaurants.restaurantId })
    .from(pinnedRestaurants)
    .where(eq(pinnedRestaurants.userId, user.id));

  return Response.json({ restaurantIds: rows.map((r) => r.restaurantId) });
}

export async function POST({ locals, request }: APIContext): Promise<Response> {
  const user = locals.user;
  if (!user) return Response.json({ error: "Non autenticato" }, { status: 401 });

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return Response.json({ error: "Corpo non valido" }, { status: 400 });
  }

  if (!isValidPinBody(raw)) {
    return Response.json({ error: "restaurantId richiesto" }, { status: 400 });
  }

  await locals.db
    .insert(pinnedRestaurants)
    .values({ userId: user.id, restaurantId: raw.restaurantId })
    .onConflictDoNothing();

  return Response.json({ ok: true }, { status: 201 });
}

export async function DELETE({ locals, request }: APIContext): Promise<Response> {
  const user = locals.user;
  if (!user) return Response.json({ error: "Non autenticato" }, { status: 401 });

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return Response.json({ error: "Corpo non valido" }, { status: 400 });
  }

  if (!isValidPinBody(raw)) {
    return Response.json({ error: "restaurantId richiesto" }, { status: 400 });
  }

  await locals.db
    .delete(pinnedRestaurants)
    .where(
      and(
        eq(pinnedRestaurants.userId, user.id),
        eq(pinnedRestaurants.restaurantId, raw.restaurantId),
      ),
    );

  return Response.json({ ok: true });
}
