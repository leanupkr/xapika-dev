"use client";

import { useEffect, useState } from "react";

/**
 * Returns `true` after the component has mounted on the client.
 *
 * Prevents SSR/client hydration mismatches for components that render
 * differently on server vs. client (e.g. react-simple-maps path calculations).
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
}
