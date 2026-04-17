import type { APIContext } from "astro";
import { events } from "../../../../db/schema";
import { eq, asc, gte, and as dbAnd, or } from "drizzle-orm";
import { getTodayISO } from "../../../../utils/date";

export async function GET({ locals, params }: APIContext): Promise<Response> {
  const db = locals.db;
  const id = Number(params.id);
  const today = getTodayISO();

  const linkedEvents = await db
    .select()
    .from(events)
    .where(
      dbAnd(
        eq(events.restaurantId, id),
        eq(events.active, 1),
        eq(events.deleted, 0),
        or(gte(events.dateStart, today), gte(events.dateEnd, today)),
      ),
    )
    .orderBy(asc(events.dateStart), asc(events.timeStart));

  const publicEvents = linkedEvents.map(({ ownerId: _, ...rest }) => rest);

  return Response.json({ events: publicEvents });
}
