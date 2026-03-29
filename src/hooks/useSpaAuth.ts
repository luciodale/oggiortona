import { atom, useAtomValue } from "jotai";

type AuthData = {
  user: { id: string; name: string | null; email: string | null; avatarUrl: string | null } | null;
  isAdmin: boolean;
};

export const authAtom = atom<AuthData>({ user: null, isAdmin: false });

export function useSpaAuth() {
  return useAtomValue(authAtom);
}
