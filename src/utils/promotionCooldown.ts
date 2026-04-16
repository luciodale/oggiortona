import { and, asc, count, eq, gt, sql } from "drizzle-orm";
import type { Db } from "../db/client";
import { promotionBumps } from "../db/schema";

export const COOLDOWN_MAX = 3;
export const COOLDOWN_WINDOW_HOURS = 12;

const WINDOW_MS = COOLDOWN_WINDOW_HOURS * 60 * 60 * 1000;
const CUTOFF_EXPR = sql<string>`datetime('now', '-' || ${COOLDOWN_WINDOW_HOURS} || ' hours')`;

export type CooldownSnapshot = {
  max: number;
  windowHours: number;
  used: number;
  nextSlotAt: string | null;
  remainingMs: number | null;
};

export async function insertBump(db: Db, restaurantId: number, action: "create" | "renew") {
  await db.insert(promotionBumps).values({ restaurantId, action });
}

async function countInWindow(db: Db, restaurantId: number) {
  const [row] = await db
    .select({ count: count() })
    .from(promotionBumps)
    .where(and(
      eq(promotionBumps.restaurantId, restaurantId),
      gt(promotionBumps.createdAt, CUTOFF_EXPR),
    ));
  return row?.count ?? 0;
}

async function oldestInWindow(db: Db, restaurantId: number) {
  const [row] = await db
    .select({ createdAt: promotionBumps.createdAt })
    .from(promotionBumps)
    .where(and(
      eq(promotionBumps.restaurantId, restaurantId),
      gt(promotionBumps.createdAt, CUTOFF_EXPR),
    ))
    .orderBy(asc(promotionBumps.createdAt))
    .limit(1);
  return row?.createdAt ?? null;
}

function parseSqliteUtc(value: string) {
  // SQLite datetime('now') format: "YYYY-MM-DD HH:MM:SS" (UTC, no TZ suffix)
  return new Date(value.replace(" ", "T") + "Z");
}

export async function buildCooldownSnapshot(db: Db, restaurantId: number): Promise<CooldownSnapshot> {
  const [used, oldest] = await Promise.all([
    countInWindow(db, restaurantId),
    oldestInWindow(db, restaurantId),
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

export async function isCooldownActive(db: Db, restaurantId: number) {
  const used = await countInWindow(db, restaurantId);
  return used >= COOLDOWN_MAX;
}
