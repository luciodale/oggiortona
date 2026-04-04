import type { APIContext } from "astro";
import { events, restaurants } from "../../../db/schema";
import { lt, desc, eq, and as dbAnd, or, isNull } from "drizzle-orm";
import { getTodayISO } from "../../../utils/date";

const PAST_EVENTS_LIMIT = 100;

export async function GET({ locals }: APIContext): Promise<Response> {
  const db = locals.db;
  const today = getTodayISO();

  // Past = dateStart < today AND (dateEnd < today OR dateEnd IS NULL)
  // This excludes multi-day events still ongoing today
  const rows = await db
    .select({ event: events, restaurantName: restaurants.name })
    .from(events)
    .leftJoin(restaurants, eq(events.restaurantId, restaurants.id))
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

  const pastEvents = rows.map(({ event, restaurantName }) => ({
    ...event,
    restaurantName: restaurantName ?? null,
  }));

  return Response.json({ events: pastEvents });
}
