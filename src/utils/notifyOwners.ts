import type { Db } from "../db/client";
import { pushSubscriptions, promotions, restaurants } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { getTodayISO } from "./date";
import { sendWebPush } from "./webpush";
import { buildOwnerPayloads } from "./ownerNotificationPayload";
import { extractStaleEndpoints } from "./pushResults";

type VapidEnv = {
  VAPID_PUBLIC_KEY: string;
  VAPID_PRIVATE_KEY: string;
  VAPID_SUBJECT: string;
};

export async function notifyOwners(db: Db, env: VapidEnv) {
  const today = getTodayISO();

  const expiring = await db
    .select({
      ownerId: restaurants.ownerId,
      promotionId: promotions.id,
    })
    .from(promotions)
    .innerJoin(restaurants, eq(promotions.restaurantId, restaurants.id))
    .where(eq(promotions.dateEnd, today));

  if (expiring.length === 0) return;

  const payloads = buildOwnerPayloads(expiring);

  const ownerSubs = await db.select().from(pushSubscriptions)
    .where(eq(pushSubscriptions.scope, "owner"));

  const subsByUser = new Map<string, typeof ownerSubs>();
  for (const sub of ownerSubs) {
    if (!sub.userId) continue;
    const list = subsByUser.get(sub.userId) ?? [];
    list.push(sub);
    subsByUser.set(sub.userId, list);
  }

  const vapid = {
    publicKey: env.VAPID_PUBLIC_KEY,
    privateKey: env.VAPID_PRIVATE_KEY,
    subject: env.VAPID_SUBJECT,
  };

  const allEndpoints: Array<string> = [];
  const allResults: Array<PromiseSettledResult<{ success: boolean; status: number }>> = [];

  for (const payload of payloads) {
    const subs = subsByUser.get(payload.userId);
    if (!subs) continue;

    const results = await Promise.allSettled(
      subs.map((sub) =>
        sendWebPush(
          { endpoint: sub.endpoint, p256dh: sub.p256dh, auth: sub.auth },
          { title: payload.title, body: payload.body, url: payload.url },
          vapid,
        ),
      ),
    );

    allEndpoints.push(...subs.map((s) => s.endpoint));
    allResults.push(...results);
  }

  const stale = extractStaleEndpoints(allEndpoints, allResults);
  if (stale.length > 0) {
    await Promise.allSettled(
      stale.map((endpoint) =>
        db.delete(pushSubscriptions).where(
          and(eq(pushSubscriptions.endpoint, endpoint), eq(pushSubscriptions.scope, "owner")),
        ),
      ),
    );
  }
}
