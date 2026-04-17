import type { APIContext } from "astro";
import { pinnedStores } from "../../db/schema";
import { eq, and } from "drizzle-orm";

function isValidPinBody(raw: unknown): raw is { storeId: number } {
  if (typeof raw !== "object" || raw === null) return false;
  const obj = raw as Record<string, unknown>;
  return typeof obj.storeId === "number" && Number.isInteger(obj.storeId);
}

export async function GET({ locals }: APIContext): Promise<Response> {
  const user = locals.user;
  if (!user) return Response.json({ error: "Non autenticato" }, { status: 401 });

  const rows = await locals.db
    .select({ storeId: pinnedStores.storeId })
    .from(pinnedStores)
    .where(eq(pinnedStores.userId, user.id));

  return Response.json({ storeIds: rows.map((r) => r.storeId) });
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
    return Response.json({ error: "storeId richiesto" }, { status: 400 });
  }

  await locals.db
    .insert(pinnedStores)
    .values({ userId: user.id, storeId: raw.storeId })
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
    return Response.json({ error: "storeId richiesto" }, { status: 400 });
  }

  await locals.db
    .delete(pinnedStores)
    .where(
      and(
        eq(pinnedStores.userId, user.id),
        eq(pinnedStores.storeId, raw.storeId),
      ),
    );

  return Response.json({ ok: true });
}
