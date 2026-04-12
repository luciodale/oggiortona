import type { RestaurantWithStatus } from "../types/domain";

export function sortRestaurants(restaurants: Array<RestaurantWithStatus>, pinnedIds: Set<number>) {
  return [...restaurants].sort((a, b) => {
    // Tier 0: pinned restaurants first
    const aPinned = pinnedIds.has(a.id) ? 1 : 0;
    const bPinned = pinnedIds.has(b.id) ? 1 : 0;
    if (aPinned !== bPinned) return bPinned - aPinned;

    // Tier 1: currently open
    const aOpen = a.isOpen ? 1 : 0;
    const bOpen = b.isOpen ? 1 : 0;
    if (aOpen !== bOpen) return bOpen - aOpen;

    // Tier 2: has any promotion, newest createdAt first
    const aNewest = newestPromotionCreatedAt(a);
    const bNewest = newestPromotionCreatedAt(b);
    const aHasPromo = aNewest !== null ? 1 : 0;
    const bHasPromo = bNewest !== null ? 1 : 0;
    if (aHasPromo !== bHasPromo) return bHasPromo - aHasPromo;
    if (aNewest && bNewest) {
      const cmp = bNewest.localeCompare(aNewest);
      if (cmp !== 0) return cmp;
    }

    // Tier 3: alphabetical
    return a.name.localeCompare(b.name, "it");
  });
}

function newestPromotionCreatedAt(r: RestaurantWithStatus): string | null {
  if (r.promotions.length === 0) return null;
  let newest = r.promotions[0]!.createdAt;
  for (let i = 1; i < r.promotions.length; i++) {
    const c = r.promotions[i]!.createdAt;
    if (c > newest) newest = c;
  }
  return newest;
}
