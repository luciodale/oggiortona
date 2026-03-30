import type { APIContext } from "astro";
import { events } from "../../../db/schema";
import { lt, desc, eq, and as dbAnd, or, isNull } from "drizzle-orm";

const PAST_EVENTS_LIMIT = 100;

export async function GET({ locals }: APIContext): Promise<Response> {
  const db = locals.db;
  const today = new Date().toISOString().split("T")[0]!;

  // Past = dateStart < today AND (dateEnd < today OR dateEnd IS NULL)
  // This excludes multi-day events still ongoing today
  const pastEvents = await db
    .select()
    .from(events)
    .where(
      dbAnd(
        eq(events.active, 1),
        eq(events.deleted, 0),
        lt(events.dateStart, today),
        or(lt(events.dateEnd, today), isNull(events.dateEnd)),
      ),
    )
    .orderBy(desc(events.dateStart), desc(events.timeStart))
    .limit(PAST_EVENTS_LIMIT);

  return Response.json({ events: pastEvents });
}
