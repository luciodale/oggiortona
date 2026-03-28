import type { APIContext } from "astro";
import type { D1Database } from "@cloudflare/workers-types";
import type { DailySpecialRow } from "../../types/database";
import type { DailySpecialsResponse } from "../../types/api";
import { getTodayISO } from "../../utils/date";

export async function GET({ locals }: APIContext): Promise<Response> {
  const db = locals.runtime.env.DB as D1Database;
  const today = getTodayISO();

  const specials = await db
    .prepare(
      `SELECT ds.*, r.name as restaurant_name
       FROM daily_specials ds
       JOIN restaurants r ON r.id = ds.restaurant_id
       WHERE ds.date = ? AND r.active = 1
       ORDER BY ds.created_at DESC`,
    )
    .bind(today)
    .all<DailySpecialRow & { restaurant_name: string }>();

  const response: DailySpecialsResponse = {
    specials: specials.results,
  };

  return new Response(JSON.stringify(response), {
    headers: { "Content-Type": "application/json" },
  });
}
