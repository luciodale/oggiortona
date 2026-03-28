import type { APIContext } from "astro";
import type { D1Database } from "@cloudflare/workers-types";
import type { RestaurantRow, DailySpecialRow, DealRow } from "../../../types/database";
import type { RestaurantDetailResponse } from "../../../types/api";
import { isOpenNow, parseOpeningHours } from "../../../utils/time";
import { getTodayISO } from "../../../utils/date";
import { parseTypes } from "../../../utils/restaurant";

export async function GET({ locals, params }: APIContext): Promise<Response> {
  const db = locals.runtime.env.DB as D1Database;
  const id = params.id;

  const restaurant = await db
    .prepare("SELECT * FROM restaurants WHERE id = ? AND active = 1")
    .bind(id)
    .first<RestaurantRow>();

  if (!restaurant) {
    return new Response(JSON.stringify({ error: "Ristorante non trovato", status: 404 }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const today = getTodayISO();
  const [special, deal] = await Promise.all([
    db.prepare("SELECT * FROM daily_specials WHERE restaurant_id = ? AND date = ?").bind(id, today).first<DailySpecialRow>(),
    db.prepare("SELECT * FROM deals WHERE restaurant_id = ? AND valid_from <= datetime('now') AND valid_until > datetime('now') ORDER BY valid_until ASC LIMIT 1").bind(id).first<DealRow>(),
  ]);

  const { opening_hours, type, ...rest } = restaurant;
  const parsedHours = parseOpeningHours(opening_hours);

  const response: RestaurantDetailResponse = {
    restaurant: {
      ...rest,
      types: parseTypes(type),
      is_open: isOpenNow(parsedHours),
      today_special: special ?? null,
      active_deal: deal ?? null,
      parsed_hours: parsedHours,
    },
  };

  return new Response(JSON.stringify(response), {
    headers: { "Content-Type": "application/json" },
  });
}
