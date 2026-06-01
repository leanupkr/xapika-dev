import dynamic from "next/dynamic";

/**
 * SSR-safe dynamic imports for react-simple-maps.
 * These five components and the GEO_URL constant were duplicated across
 * GlobalPresence, UzbekRouteMap, and LocationsWorldMap with identical options.
 * Import them from here instead.
 */

export const GEO_URL = "/data/world-atlas.json";

export const ComposableMap = dynamic(
  () => import("react-simple-maps").then((m) => m.ComposableMap),
  { ssr: false },
);
export const Geographies = dynamic(
  () => import("react-simple-maps").then((m) => m.Geographies),
  { ssr: false },
);
export const Geography = dynamic(
  () => import("react-simple-maps").then((m) => m.Geography),
  { ssr: false },
);
export const Marker = dynamic(
  () => import("react-simple-maps").then((m) => m.Marker),
  { ssr: false },
);
export const Line = dynamic(
  () => import("react-simple-maps").then((m) => m.Line),
  { ssr: false },
);
