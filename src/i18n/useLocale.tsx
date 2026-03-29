import { atom, useAtomValue } from "jotai";
import type { Locale } from "../types/domain";
import { t as tFn, type TranslationKey } from "./t";

export const localeAtom = atom<Locale>("it");

export function useLocale() {
  const locale = useAtomValue(localeAtom);
  return {
    locale,
    t: (key: TranslationKey, params?: Record<string, string | number>) => tFn(key, locale, params),
  };
}