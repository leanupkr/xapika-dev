// src/app/studio/[[...tool]]/page.tsx
export const dynamic = "force-static";
export { metadata, viewport } from "next-sanity/studio";

import StudioClient from "../StudioClient";

// StudioClient (not NextStudio directly) is imported here: this file is a
// Server Component, and importing `sanity.config.ts` — which pulls in
// `sanity`/`sanity/structure` — at its top level would evaluate Studio's
// full module graph under the RSC `react-server` condition, breaking on
// `swr`'s react-server export (see StudioClient.tsx for the full
// explanation). Routing the config import through a "use client" module
// keeps that graph out of the server bundle entirely.
//
// This still pre-renders fine at build time even before
// NEXT_PUBLIC_SANITY_PROJECT_ID is set — NextStudio constructs its own
// Sanity client in the browser at runtime. `robots.txt` also disallows
// `/studio` directly (see src/app/robots.txt/route.ts); the `noindex`
// metadata re-exported above is the second layer of that.
export default function StudioPage() {
  return <StudioClient />;
}
