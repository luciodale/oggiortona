import { and, asc, count, eq, gt, sql } from "drizzle-orm";
import type { Db } from "../db/client";
import { storePromotionBumps } from "../db/schema";
import type { CooldownSnapshot } from "./promotionCooldown";
import { COOLDOWN_MAX, COOLDOWN_WINDOW_HOURS } from "./promotionCooldown";

const WINDOW_MS = COOLDOWN_WINDOW_HOURS * 60 * 60 * 1000;
const CUTOFF_EXPR = sql<string>`datetime('now', '-' || ${COOLDOWN_WINDOW_HOURS} || ' hours')`;

export async function insertStoreBump(db: Db, storeId: number, action: "create" | "renew") {
  await db.insert(storePromotionBumps).values({ storeId, action });
}

async function countInWindow(db: Db, storeId: number) {
  const [row] = await db
    .select({ count: count() })
    .from(storePromotionBumps)
    .where(and(
      eq(storePromotionBumps.storeId, storeId),
      gt(storePromotionBumps.createdAt, CUTOFF_EXPR),
    ));
  return row?.count ?? 0;
}

async function oldestInWindow(db: Db, storeId: number) {
  const [row] = await db
    .select({ createdAt: storePromotionBumps.createdAt })
    .from(storePromotionBumps)
    .where(and(
      eq(storePromotionBumps.storeId, storeId),
      gt(storePromotionBumps.createdAt, CUTOFF_EXPR),
    ))
    .orderBy(asc(storePromotionBumps.createdAt))
    .limit(1);
  return row?.createdAt ?? null;
}

function parseSqliteUtc(value: string) {
  return new Date(value.replace(" ", "T") + "Z");
}

export async function buildStoreCooldownSnapshot(db: Db, storeId: number): Promise<CooldownSnapshot> {
  const [used, oldest] = await Promise.all([
    countInWindow(db, storeId),
    oldestInWindow(db, storeId),
  ]);

  if (used < COOLDOWN_MAX || !oldest) {
    return { max: COOLDOWN_MAX, windowHours: COOLDOWN_WINDOW_HOURS, used, nextSlotAt: null, remainingMs: null };
  }

  const nextSlotMs = parseSqliteUtc(oldest).getTime() + WINDOW_MS;
  const remainingMs = Math.max(0, nextSlotMs - Date.now());
  return {
    max: COOLDOWN_MAX,
    windowHours: COOLDOWN_WINDOW_HOURS,
    used,
    nextSlotAt: new Date(nextSlotMs).toISOString(),
    remainingMs,
  };
}

export async function isStoreCooldownActive(db: Db, storeId: number) {
  const used = await countInWindow(db, storeId);
  return used >= COOLDOWN_MAX;
}
