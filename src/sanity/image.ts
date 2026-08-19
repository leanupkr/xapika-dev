// src/sanity/image.ts
import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { projectId, dataset } from "./env";

// v2 plan verification note (2026-08-19, this implementation): the default
// export of @sanity/image-url@2.1.1 is deprecated in favor of the named
// export `createImageUrlBuilder` — confirmed by reading the package's own
// compiled .d.ts/.ts source directly (not assumed).
const builder = createImageUrlBuilder({ projectId, dataset });

/**
 * Builds a Sanity image URL for rendering via a plain <img> tag rather than
 * next/image. Deliberate design choice (see NEWS_CMS_PLAN.md §8.4): routing
 * Sanity images through next/image would pull in Vercel Image Optimization
 * as an additional billable resource. Sanity's own Image CDN already does
 * resize/format-conversion/hotspot-crop, so there is nothing to gain by
 * double-processing.
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

/** Builds a responsive <img srcSet> value across the given widths. */
export function srcSetFor(source: SanityImageSource, widths: number[]): string {
  return widths
    .map((w) => `${urlFor(source).width(w).auto("format").quality(75).url()} ${w}w`)
    .join(", ");
}
