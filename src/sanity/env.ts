// src/sanity/env.ts
//
// Single source of truth for Sanity connection config. The Sanity project
// itself does not exist yet (it will be created later by info@xapika.pl —
// see NEWS_CMS_PLAN.md §10, Day 1). Until NEXT_PUBLIC_SANITY_PROJECT_ID is
// set in .env.local / Vercel env vars, this module MUST NOT throw: `next
// build` and `tsc --noEmit` both have to succeed with zero Sanity
// configuration present. Every export below falls back to a safe value.
// Once the real project id is set, nothing here needs to change — the app
// picks it up automatically on next deploy.
//
// Client construction safety (why `projectId` is allowed to be "" here):
// @sanity/client's `createClient()` throws synchronously — at construction
// time, not fetch time — if `projectId` is falsy. That means this module
// deliberately does NOT paper over an empty projectId with a placeholder;
// it reports the real, honest value. The construction-safety workaround
// (substituting a syntactically valid placeholder id so `createClient()`
// itself never throws) lives in `src/sanity/client.ts`, one layer up, where
// it belongs — see the comment there.

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

// Date-pinned on purpose — "latest" is banned. A pinned API version means a
// future Sanity API change can never silently alter query results in
// production; upgrading is an explicit, reviewed decision instead.
export const apiVersion = "2026-08-01";

if (!projectId && typeof window === "undefined") {
  // Server-only warning (avoids a duplicate/noisy console message on every
  // client-side navigation in the browser). This is informational, not
  // fatal — see the module comment above for why we never throw here.
  console.warn(
    "[sanity] NEXT_PUBLIC_SANITY_PROJECT_ID is not set. News content will be unavailable until the Sanity project is created and this env var is configured — see .env.local.example.",
  );
}
