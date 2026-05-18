"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function PageTransition() {
  const pathname = usePathname();
  const [animKey, setAnimKey] = useState(0);
  const [firstRender, setFirstRender] = useState(true);

  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
      return;
    }
    setAnimKey((k) => k + 1);
  }, [pathname, firstRender]);

  if (firstRender) return null;

  return (
    <div
      key={animKey}
      aria-hidden="true"
      className="page-transition-sweep"
    />
  );
}
