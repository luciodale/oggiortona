import type { Db } from "../db/client";
import { pushSubscriptions } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { sendWebPush } from "./webpush";
import { extractStaleEndpoints } from "./pushResults";

type VapidEnv = {
  VAPID_PUBLIC_KEY: string;
  VAPID_PRIVATE_KEY: string;
  VAPID_SUBJECT: string;
};

type BroadcastPayload = {
  title: string;
  body: string;
};

export async function broadcastNotification(db: Db, env: VapidEnv, payload: BroadcastPayload) {
  const subs = await db.select().from(pushSubscriptions)
    .where(eq(pushSubscriptions.scope, "general"));

  if (subs.length === 0) return { sent: 0, failed: 0 };

  const vapid = {
    publicKey: env.VAPID_PUBLIC_KEY,
    privateKey: env.VAPID_PRIVATE_KEY,
    subject: env.VAPID_SUBJECT,
  };

  const pushPayload = { title: payload.title, body: payload.body, url: "/" };

  const results = await Promise.allSettled(
    subs.map((sub) =>
      sendWebPush(
        { endpoint: sub.endpoint, p256dh: sub.p256dh, auth: sub.auth },
        pushPayload,
        vapid,
      ),
    ),
  );

  let sent = 0;
  let failed = 0;
  for (const result of results) {
    if (result.status === "fulfilled" && result.value.success) {
      sent++;
    } else {
      failed++;
    }
  }

  const stale = extractStaleEndpoints(subs.map((s) => s.endpoint), results);
  if (stale.length > 0) {
    await Promise.allSettled(
      stale.map((endpoint) =>
        db.delete(pushSubscriptions).where(
          and(eq(pushSubscriptions.endpoint, endpoint), eq(pushSubscriptions.scope, "general")),
        ),
      ),
    );
  }

  return { sent, failed };
}
