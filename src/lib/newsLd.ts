// src/lib/newsLd.ts
//
// JSON-LD builders for the News feature, following the same idiom as
// src/components/seo/JsonLd.tsx: plain functions returning a schema.org
// data object, `(origin, input)` signature, consumed via
// `<JsonLd data={...} />`. Kept in a separate module (rather than added to
// JsonLd.tsx directly) because these two builders depend on News-specific
// types (@/sanity/types) and the Sanity image URL builder, which the rest
// of JsonLd.tsx has no reason to import.
import { PL_ORIGIN, hostSiteUrl } from "./seo-host";
import { SITE_DISPLAY_NAME } from "./seo";
import { urlFor } from "@/sanity/image";
import type { NewsCardData, NewsPost } from "@/sanity/types";

// Same stable @id as JsonLd.tsx's ORG_ID — always PL regardless of serving
// domain, so the two files' output can be cross-referenced by consumers.
const ORG_ID = `${PL_ORIGIN}/#organization`;

/**
 * NewsArticle for a single /news/[slug] detail page.
 * For kind: "external" posts, `url` points at the original publisher (the
 * canonical location of the article per Google's NewsArticle guidance),
 * while `@id`/mainEntityOfPage still point at the Xapika page that surfaces it.
 */
export function newsArticleLd(
  origin: string,
  input: Pick<NewsPost, "kind" | "title" | "excerpt" | "publishedAt" | "coverImage" | "externalUrl">
    & { slug: string },
) {
  const { slug, kind, title, excerpt, publishedAt, coverImage, externalUrl } = input;
  const pageUrl = hostSiteUrl(origin, `news/${slug}`);
  const canonicalUrl = kind === "external" && externalUrl ? externalUrl : pageUrl;
  const image = coverImage
    ? urlFor(coverImage).width(1200).height(630).fit("crop").auto("format").url()
    : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "@id": pageUrl,
    mainEntityOfPage: pageUrl,
    url: canonicalUrl,
    headline: title,
    description: excerpt,
    datePublished: publishedAt,
    dateModified: publishedAt,
    inLanguage: "en-US",
    publisher: { "@id": ORG_ID },
    ...(kind === "own" ? { author: { "@id": ORG_ID } } : {}),
    ...(image ? { image: [image] } : {}),
  };
}

/**
 * CollectionPage + ItemList for the /news listing page. `posts` should be
 * the already-fetched, already-ordered list for that page (featured-first,
 * newest-first — see newsListQuery) so item `position` matches what's
 * actually rendered.
 */
export function newsCollectionLd(
  origin: string,
  input: { posts: ReadonlyArray<Pick<NewsCardData, "slug" | "title">> },
) {
  const { posts } = input;
  const collectionUrl = hostSiteUrl(origin, "news");

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${collectionUrl}/#collection`,
    url: collectionUrl,
    name: `News — ${SITE_DISPLAY_NAME}`,
    description: "Company announcements, project milestones, and press coverage.",
    isPartOf: { "@id": `${PL_ORIGIN}/#website` },
    inLanguage: "en-US",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts.map((post, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: hostSiteUrl(origin, `news/${post.slug}`),
        name: post.title,
      })),
    },
  };
}
