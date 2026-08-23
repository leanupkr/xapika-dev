// src/sanity/fetch.ts
//
// Error-handling contract — every caller of `sanityFetch()` must follow
// this (documented here once so it doesn't have to be re-derived per
// file):
//
//   `sanityFetch()` ALWAYS THROWS on failure. It never returns null,
//   undefined, or an empty value to signal "no data" — not for a missing
//   Sanity project id, not for a network error, not for a malformed GROQ
//   query. Every call site is responsible for wrapping its own call in
//   try/catch and choosing the fallback that makes sense for that UI (an
//   empty array for a list page, `notFound()` for a detail page, skipping
//   a sitemap entry, etc.).
//
// Rationale: with the Sanity project not yet created, every page in this
// app that reads news content needs *some* graceful-degradation path, and
// that path differs per page (list vs. detail vs. sitemap vs. RSS). Having
// this function throw and pushing the try/catch to each call site keeps
// the failure signal in exactly one place (a thrown error) instead of
// silently returning `[]`/`null` from deep inside the data layer, where a
// real bug (e.g. a typo'd GROQ query) could be mistaken for "just no
// content yet" and go unnoticed.
import { sanityClient } from "./client";

export async function sanityFetch<T>(input: {
  query: string;
  params?: Record<string, unknown>;
  tags?: string[];
}): Promise<T> {
  const { query, params = {}, tags } = input;

  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    throw new Error(
      "[sanity] NEXT_PUBLIC_SANITY_PROJECT_ID is not set — the Sanity project has not been created yet. See .env.local.example.",
    );
  }

  return sanityClient.fetch<T>(query, params, {
    next: { tags: tags ?? ["news"] },
  });
}
