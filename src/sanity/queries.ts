// src/sanity/queries.ts
import { groq } from "next-sanity";

const CARD_FIELDS = groq`
  _id, kind, title, titleKo, "slug": slug.current, excerpt, excerptKo,
  category, publishedAt, coverImage, externalUrl, externalSource, featured
`;

export const newsListQuery = groq`
  *[_type == "newsPost"] | order(featured desc, publishedAt desc) { ${CARD_FIELDS} }
`;

export const newsBySlugQuery = groq`
  *[_type == "newsPost" && slug.current == $slug][0] {
    ${CARD_FIELDS}, body, bodyKo, gallery, seoTitle, seoDescription
  }
`;

export const newsSlugsQuery = groq`*[_type == "newsPost"]{ "slug": slug.current }`;

export const newsCountQuery = groq`count(*[_type == "newsPost"])`;

// Related-articles rail on /news/[slug] (NEWS_CMS_PLAN.md §9). Pulls a pool
// of the newest other posts — RelatedNews.tsx picks same-category posts
// first and backfills from this pool, so the pool needs to be a bit larger
// than the max-3 it ultimately renders. 20 comfortably covers this site's
// expected volume (a handful of posts per month per §13(c)).
export const relatedNewsQuery = groq`
  *[_type == "newsPost" && slug.current != $slug] | order(publishedAt desc) [0...20] {
    _id, kind, title, titleKo, "slug": slug.current, excerpt, excerptKo,
    category, publishedAt, coverImage, externalUrl, externalSource, featured
  }
`;
