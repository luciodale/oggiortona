import type { APIContext } from "astro";
import { stores, storePromotions, users } from "../../../../db/schema";
import { asc, lte, gte, eq, and as dbAnd } from "drizzle-orm";
import { getTodayISO } from "../../../../utils/date";
import { requireAdmin } from "../../../../utils/adminGuard";
import { groupPromotionsByStore } from "../../../../utils/enrichStore";

export async function GET({ locals }: APIContext): Promise<Response> {
  const denied = requireAdmin(locals);
  if (denied) return denied;

  const db = locals.db;
  const today = getTodayISO();

  const [allStores, allPromotions] = await Promise.all([
    db.select({
      store: stores,
      ownerEmail: users.email,
      ownerName: users.name,
    })
      .from(stores)
      .leftJoin(users, eq(stores.ownerId, users.id))
      .where(eq(stores.deleted, 0))
      .orderBy(asc(stores.active), asc(stores.name)),
    db.select().from(storePromotions).where(dbAnd(lte(storePromotions.dateStart, today), gte(storePromotions.dateEnd, today))),
  ]);

  const grouped = groupPromotionsByStore(allPromotions);
  const result = allStores.map(({ store: s, ownerEmail, ownerName }) => ({
    ...s,
    ownerEmail,
    ownerName,
    promotions: grouped.get(s.id) ?? [],
  }));

  return Response.json({ stores: result });
}
