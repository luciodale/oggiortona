import type { Db } from "../db/client";
import { pushSubscriptions } from "../db/schema";
import { eq } from "drizzle-orm";
import { sendWebPush } from "./webpush";

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

export async function notifyAdmins(db: Db, env: VapidEnv, notification: NotificationPayload) {
  console.log("[push] notifyAdmins called:", notification.title);

  const subs = await db.select().from(pushSubscriptions);
  console.log(`[push] Found ${subs.length} subscription(s)`);
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
      console.log(`[push] Sub ${i}: status=${result.value.status}, success=${result.value.success}`, result.value.success ? "" : result.value.message);
    } else {
      console.error(`[push] Sub ${i}: rejected`, result.reason);
    }
  }

  // Remove stale subscriptions (410 Gone or 404 Not Found)
  const staleEndpoints: string[] = [];
  for (const [i, result] of results.entries()) {
    if (result.status === "fulfilled" && !result.value.success) {
      const { status } = result.value;
      if (status === 410 || status === 404) {
        staleEndpoints.push(subs[i]!.endpoint);
      }
    }
  }

  if (staleEndpoints.length > 0) {
    await Promise.allSettled(
      staleEndpoints.map((endpoint) =>
        db.delete(pushSubscriptions).where(eq(pushSubscriptions.endpoint, endpoint)),
      ),
    );
  }
}
