"use client";

// Studio (`sanity`/`sanity/structure`, pulled in by ../../../sanity.config)
// must never be imported at the top of a Server Component module. Next 16 +
// Turbopack resolves every import reachable from a Server Component's own
// module graph under the `react-server` export condition — including
// transitive dependencies pulled in by `defineConfig()`/`structureTool()`
// at config-definition time, well before NextStudio's own internal
// `lazy()` boundary ever runs. `swr@2.5.1`'s `react-server` condition has
// no default export (only `unstable_serialize`), while `sanity`'s compiled
// bundle does `import useSWR from "swr"` in several chunks
// (useBundleDocuments/validationUtils/schedules) — so importing
// `sanity.config.ts` directly from `page.tsx` (a Server Component) broke
// `next build` with "Export default doesn't exist in target module".
//
// Moving the config import behind this "use client" boundary means it's
// only ever bundled under browser/Client-Component-SSR conditions, where
// swr's default export resolves normally — page.tsx itself now only holds
// a client-reference to this file, never evaluates `sanity` in the RSC
// graph.
import { NextStudio } from "next-sanity/studio";
import config from "../../../sanity.config";

export default function StudioClient() {
  return <NextStudio config={config} />;
}
