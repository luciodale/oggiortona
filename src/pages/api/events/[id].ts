import type { APIContext } from "astro";
import type { D1Database } from "@cloudflare/workers-types";
import type { EventRow } from "../../../types/database";
import type { EventDetailResponse } from "../../../types/api";

export async function GET({ locals, params }: APIContext): Promise<Response> {
  const db = locals.runtime.env.DB as D1Database;
  const id = params.id;

  const event = await db
    .prepare("SELECT * FROM events WHERE id = ?")
    .bind(id)
    .first<EventRow>();

  if (!event) {
    return new Response(
      JSON.stringify({ error: "Evento non trovato", status: 404 }),
      { status: 404, headers: { "Content-Type": "application/json" } },
    );
  }

  const response: EventDetailResponse = { event };

  return new Response(JSON.stringify(response), {
    headers: { "Content-Type": "application/json" },
  });
}
