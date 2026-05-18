"use client";

import { useSyncExternalStore } from "react";

/**
 * useSyncExternalStore 기반 미디어쿼리 훅.
 * useEffect + useState 패턴 대비 hydration 깜빡임 없음.
 * SSR fallback → false (서버에서는 항상 false 반환).
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
