import type { APIContext } from "astro";
import type { D1Database } from "@cloudflare/workers-types";
import type { RestaurantRow, DailySpecialRow, DealRow } from "../../types/database";
import type { RestaurantListResponse } from "../../types/api";
import { isOpenNow, parseOpeningHours } from "../../utils/time";
import { getTodayISO } from "../../utils/date";
import { parseTypes } from "../../utils/restaurant";

export async function GET({ locals, request }: APIContext): Promise<Response> {
  const db = locals.runtime.env.DB as D1Database;
  const url = new URL(request.url);

  const typeFilter = url.searchParams.get("type");
  const openNow = url.searchParams.get("open_now") === "true";
  const hasSpecial = url.searchParams.get("has_special") === "true";
  const sort = url.searchParams.get("sort") ?? "name";

  const today = getTodayISO();

  const [restaurants, specials, deals] = await Promise.all([
    db.prepare("SELECT * FROM restaurants WHERE active = 1 ORDER BY name").all<RestaurantRow>(),
    db.prepare("SELECT * FROM daily_specials WHERE date = ?").bind(today).all<DailySpecialRow>(),
    db.prepare("SELECT * FROM deals WHERE valid_from <= datetime('now') AND valid_until > datetime('now')").all<DealRow>(),
  ]);

  const specialsByRestaurant = new Map<number, DailySpecialRow>();
  for (const special of specials.results) {
    specialsByRestaurant.set(special.restaurant_id, special);
  }

  const dealsByRestaurant = new Map<number, DealRow>();
  for (const deal of deals.results) {
    dealsByRestaurant.set(deal.restaurant_id, deal);
  }

  let enriched = restaurants.results.map((r) => {
    const { opening_hours, type, ...rest } = r;
    const parsedHours = parseOpeningHours(opening_hours);
    return {
      ...rest,
      types: parseTypes(type),
      is_open: isOpenNow(parsedHours),
      today_special: specialsByRestaurant.get(r.id) ?? null,
      active_deal: dealsByRestaurant.get(r.id) ?? null,
      parsed_hours: parsedHours,
    };
  });

  if (typeFilter) {
    enriched = enriched.filter((r) => r.types.includes(typeFilter as never));
  }
  if (openNow) {
    enriched = enriched.filter((r) => r.is_open);
  }
  if (hasSpecial) {
    enriched = enriched.filter((r) => r.today_special !== null);
  }

  if (sort === "price_range") {
    enriched.sort((a, b) => a.price_range - b.price_range);
  }

  const response: RestaurantListResponse = {
    restaurants: enriched,
    count: enriched.length,
  };

  return new Response(JSON.stringify(response), {
    headers: { "Content-Type": "application/json" },
  });
}
