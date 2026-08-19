// src/sanity/client.ts
import { createClient } from "next-sanity";
import { projectId, dataset, apiVersion } from "./env";

// @sanity/client's `createClient()` validates `projectId` synchronously —
// it throws `Configuration must contain \`projectId\`` at CONSTRUCTION time
// (not fetch time) whenever the value is falsy, and throws again if it
// fails the `/^[-a-z0-9]+$/i` format check (verified by reading
// node_modules/@sanity/client's compiled `initConfig()` directly). Since
// `env.ts` intentionally reports an empty string before the Sanity project
// exists, constructing the client with that raw value here would crash
// `next build` and every route that imports this module. We substitute a
// syntactically valid placeholder id only for construction; it does not
// point at a real project, so any `fetch()` against it fails at the
// network layer (DNS/404) exactly like a real outage would — which
// `sanityFetch()` in ./fetch.ts already turns into a normal rejected
// promise for callers to catch. No separate "unconfigured" code path is
// needed downstream of this file.
const safeProjectId = projectId || "placeholder-project";

export const sanityClient = createClient({
  projectId: safeProjectId,
  dataset,
  apiVersion,
  // Required, not a nice-to-have. Sanity's CDN has its own TTL (tens of
  // seconds) that is completely independent of Next's
  // revalidateTag/revalidatePath. News relies on webhook-triggered
  // immediate revalidation as its core freshness guarantee — useCdn:true
  // would silently defeat that by serving stale CDN responses in between.
  useCdn: false,
  perspective: "published",
});
