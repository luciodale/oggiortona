import type { StoreWithStatus } from "../types/domain";

export function sortStores(stores: Array<StoreWithStatus>, pinnedIds: Set<number>) {
  return [...stores].sort((a, b) => {
    const aPinned = pinnedIds.has(a.id) ? 1 : 0;
    const bPinned = pinnedIds.has(b.id) ? 1 : 0;
    if (aPinned !== bPinned) return bPinned - aPinned;

    const aOpen = a.isOpen ? 1 : 0;
    const bOpen = b.isOpen ? 1 : 0;
    if (aOpen !== bOpen) return bOpen - aOpen;

    const aNewest = newestPromotionCreatedAt(a);
    const bNewest = newestPromotionCreatedAt(b);
    const aHasPromo = aNewest !== null ? 1 : 0;
    const bHasPromo = bNewest !== null ? 1 : 0;
    if (aHasPromo !== bHasPromo) return bHasPromo - aHasPromo;
    if (aNewest && bNewest) {
      const cmp = bNewest.localeCompare(aNewest);
      if (cmp !== 0) return cmp;
    }

    return a.name.localeCompare(b.name, "it");
  });
}

function newestPromotionCreatedAt(s: StoreWithStatus): string | null {
  if (s.promotions.length === 0) return null;
  let newest = s.promotions[0]!.createdAt;
  for (let i = 1; i < s.promotions.length; i++) {
    const c = s.promotions[i]!.createdAt;
    if (c > newest) newest = c;
  }
  return newest;
}
