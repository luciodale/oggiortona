export function filterBySearch<T>(
  items: Array<T>,
  search: string,
  getText: (item: T) => string,
): Array<T> {
  const trimmed = search.trim().toLowerCase();
  if (!trimmed) return items;
  return items.filter((item) => getText(item).toLowerCase().includes(trimmed));
}
