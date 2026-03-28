import type { APIContext } from "astro";
import type { D1Database } from "@cloudflare/workers-types";
import type { EventRow } from "../../types/database";
import type { EventListResponse } from "../../types/api";

export async function GET({ locals, request }: APIContext): Promise<Response> {
  const db = locals.runtime.env.DB as D1Database;
  const url = new URL(request.url);

  const category = url.searchParams.get("category");
  const period = url.searchParams.get("period") ?? "all";

  let sql = "SELECT * FROM events WHERE date_start >= date('now')";
  const bindings: Array<string> = [];

  if (category) {
    sql += " AND category = ?";
    bindings.push(category);
  }

  if (period === "this_week") {
    sql += " AND date_start < date('now', '+7 days')";
  }

  sql += " ORDER BY date_start ASC, time_start ASC";

  const stmt = bindings.length > 0
    ? db.prepare(sql).bind(...bindings)
    : db.prepare(sql);

  const events = await stmt.all<EventRow>();

  const response: EventListResponse = {
    events: events.results,
    count: events.results.length,
  };

  return new Response(JSON.stringify(response), {
    headers: { "Content-Type": "application/json" },
  });
}
