import type { APIContext } from "astro";
import { events } from "../../db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET({ locals }: APIContext): Promise<Response> {
  const user = locals.user;
  if (!user) return Response.json({ error: "Non autenticato" }, { status: 401 });

  const db = locals.db;

  const userEvents = await db
    .select()
    .from(events)
    .where(eq(events.ownerId, user.id))
    .orderBy(desc(events.dateStart));

  return Response.json({ events: userEvents });
}
