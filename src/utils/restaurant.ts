export function parseTypes(typeStr: string): Array<string> {
  return typeStr.split(",").map((t) => t.trim());
}
