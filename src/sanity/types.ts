// src/sanity/types.ts
//
// Deviation from NEWS_CMS_PLAN.md §8.4 (verified against the installed
// package, not assumed): the plan's draft imports `import type { Image }
// from "sanity"`. sanity@6.9.2's public entry point does not export a type
// named `Image` — confirmed by reading node_modules/sanity/lib/index.d.ts
// directly (it re-exports hundreds of names from @sanity/types, but not
// this one; only `ImageAsset`, `ImageCrop`, `ImageUrlBuilder`, etc. are
// present, never bare `Image`). `@sanity/image-url` — an actual direct
// dependency of this project — exports the equivalent shape as
// `SanityImageObject` (asset reference + optional crop/hotspot), which is
// exactly what a Sanity `image` field with `hotspot: true` resolves to
// over GROQ. We use that instead; the field shape consumed by the frontend
// is unchanged from the plan.
import type { PortableTextBlock } from "next-sanity";
import type { SanityImageObject } from "@sanity/image-url";

export type NewsCategory =
  | "company-news"
  | "project-update"
  | "press-release"
  | "media-coverage";

/** A Sanity `image` field (hotspot-enabled) as resolved over GROQ, plus the alt text stored alongside it. */
export type NewsImage = SanityImageObject & { alt?: string };

export type NewsCardData = {
  _id: string;
  kind: "own" | "external";
  title: string;
  titleKo?: string;
  slug: string;
  excerpt: string;
  excerptKo?: string;
  category: NewsCategory;
  publishedAt: string;
  coverImage?: NewsImage | null;
  externalUrl?: string;
  externalSource?: string;
  featured: boolean;
};

export type NewsPost = NewsCardData & {
  body?: PortableTextBlock[];
  bodyKo?: PortableTextBlock[];
  gallery?: NewsImage[];
  seoTitle?: string;
  seoDescription?: string;
};
