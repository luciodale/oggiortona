import type { Db } from "../db/client";
import { pushSubscriptions } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { sendWebPush } from "./webpush";
import { extractStaleEndpoints } from "./pushResults";

type NotificationPayload = {
  title: string;
  body: string;
  url: string;
};

type VapidEnv = {
  VAPID_PUBLIC_KEY: string;
  VAPID_PRIVATE_KEY: string;
  VAPID_SUBJECT: string;
};

export async function notifyOwner(
  db: Db,
  env: VapidEnv,
  userId: string,
  notification: NotificationPayload,
) {
  console.log("[push] notifyOwner called:", userId, notification.title);

  const subs = await db
    .select()
    .from(pushSubscriptions)
    .where(and(eq(pushSubscriptions.scope, "owner"), eq(pushSubscriptions.userId, userId)));

  console.log(`[push] Found ${subs.length} owner subscription(s) for ${userId}`);
  if (subs.length === 0) return;

  const vapid = {
    publicKey: env.VAPID_PUBLIC_KEY,
    privateKey: env.VAPID_PRIVATE_KEY,
    subject: env.VAPID_SUBJECT,
  };

  const results = await Promise.allSettled(
    subs.map((sub) =>
      sendWebPush(
        { endpoint: sub.endpoint, p256dh: sub.p256dh, auth: sub.auth },
        notification,
        vapid,
      ),
    ),
  );

  for (const [i, result] of results.entries()) {
    if (result.status === "fulfilled") {
      console.log(`[push] Owner sub ${i}: status=${result.value.status}, success=${result.value.success}`, result.value.success ? "" : result.value.message);
    } else {
      console.error(`[push] Owner sub ${i}: rejected`, result.reason);
    }
  }

  const stale = extractStaleEndpoints(subs.map((s) => s.endpoint), results);
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
