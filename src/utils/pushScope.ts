import type { PushScope } from "../types/domain";

const VALID_SCOPES: ReadonlyArray<PushScope> = ["admin", "owner", "general"] as const;

export function isValidScope(value: unknown): value is PushScope {
  return typeof value === "string" && VALID_SCOPES.includes(value as PushScope);
}

export function canSubscribeToScope(
  scope: PushScope,
  user: { isAdmin: boolean; ownsRestaurants: boolean },
): boolean {
  switch (scope) {
    case "admin":
      return user.isAdmin;
    case "owner":
      return user.ownsRestaurants;
    case "general":
      return true;
  }
}

export function scopesForUser(user: { isAdmin: boolean; ownsRestaurants: boolean }): Array<PushScope> {
  const scopes: Array<PushScope> = ["general"];
  if (user.ownsRestaurants) scopes.push("owner");
  if (user.isAdmin) scopes.push("admin");
  return scopes;
}
