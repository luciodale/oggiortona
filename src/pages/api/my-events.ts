import type { APIContext } from "astro";
import { events } from "../../db/schema";
import { eq, desc, and as dbAnd } from "drizzle-orm";

export async function GET({ locals }: APIContext): Promise<Response> {
  const user = locals.user;
  if (!user) return Response.json({ error: "Non autenticato" }, { status: 401 });

  const db = locals.db;

  const userEvents = await db
    .select()
    .from(events)
    .where(dbAnd(eq(events.ownerId, user.id), eq(events.deleted, 0)))
    .orderBy(desc(events.dateStart));

  return Response.json({ events: userEvents });
}
