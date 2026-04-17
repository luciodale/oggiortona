import type { StorePromotionRow, StoreRow } from "../types/database";
import type { StoreWithStatus } from "../types/domain";
import { isOpenNow, parseOpeningHours } from "./time";
import { parseTypes } from "./restaurant";

export function groupPromotionsByStore(allPromotions: Array<StorePromotionRow>) {
  const map = new Map<number, Array<StorePromotionRow>>();
  for (const p of allPromotions) {
    const list = map.get(p.storeId) ?? [];
    list.push(p);
    map.set(p.storeId, list);
  }
  return map;
}

export function enrichStore(
  row: StoreRow,
  promotions: Array<StorePromotionRow>,
  expiredPromotionCount = 0,
  linkedEventCount = 0,
): StoreWithStatus {
  const parsedHours = parseOpeningHours(row.openingHours);
  return {
    ...row,
    types: parseTypes(row.type),
    isOpen: isOpenNow(parsedHours),
    promotions,
    parsedHours,
    expiredPromotionCount,
    linkedEventCount,
  };
}
