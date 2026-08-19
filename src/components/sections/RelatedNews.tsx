import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionOverline from "@/components/ui/SectionOverline";
import CategoryChip from "@/components/ui/CategoryChip";
import SanityImage from "@/components/ui/SanityImage";
import { sanityFetch } from "@/sanity/fetch";
import { relatedNewsQuery } from "@/sanity/queries";
import type { NewsCardData, NewsCategory } from "@/sanity/types";

const MAX_RELATED = 3;

const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "UTC", // pinned so server- and client-rendered dates always match
});

function formatPublishedDate(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "" : DATE_FORMATTER.format(date);
}

/**
 * Selection rule (NEWS_CMS_PLAN.md §9): same category first, current post
 * excluded (already excluded at the query level via `slug.current != $slug`),
 * newest first, max 3 — backfilled with the newest other-category posts
 * when the current category alone doesn't have enough.
 */
function selectRelated(
  pool: NewsCardData[],
  category: NewsCategory,
): NewsCardData[] {
  const sameCategory = pool.filter((p) => p.category === category);
  const rest = pool.filter((p) => p.category !== category);
  return [...sameCategory, ...rest].slice(0, MAX_RELATED);
}

async function getRelatedPool(slug: string): Promise<NewsCardData[]> {
  try {
    return await sanityFetch<NewsCardData[]>({
      query: relatedNewsQuery,
      params: { slug },
      tags: ["news"],
    });
  } catch (err) {
    console.error("[news] related fetch failed", err);
    return [];
  }
}

type RelatedNewsProps = {
  currentSlug: string;
  currentCategory: NewsCategory;
};

/**
 * "Related News" rail at the bottom of `/news/[slug]`. Self-fetching server
 * component (mirrors NewsGallery/NewsExternalPanel's pattern on this same
 * page) so `page.tsx` only has to render it, not thread extra data through.
 * Renders nothing when there are no other posts yet — a near-certainty right
 * after launch (NEWS_CMS_PLAN.md §9 requires the section itself to
 * disappear, not show an empty rail).
 */
export default async function RelatedNews({
  currentSlug,
  currentCategory,
}: RelatedNewsProps) {
  const pool = await getRelatedPool(currentSlug);
  const related = selectRelated(pool, currentCategory);

  if (related.length === 0) return null;

  return (
    <SectionContainer className="pt-6 pb-[clamp(80px,10vw,140px)]">
      <SectionOverline>Related News</SectionOverline>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
        {related.map((post) => (
          <RelatedCard key={post._id} post={post} />
        ))}
      </div>
    </SectionContainer>
  );
}

// Card markup mirrors NewsIndex.tsx's non-featured NewsCard exactly (same
// image treatment, external-source badge, chip/date row, hover accent bar)
// so a post never looks different between the list page and this rail —
// minus the whileInView entrance motion, which NewsIndex needs as a client
// component for its filter/pagination state but this static server-rendered
// rail doesn't (matches NewsGallery/NewsExternalPanel, the other static
// sections on this same detail page).
function RelatedCard({ post }: { post: NewsCardData }) {
  const date = formatPublishedDate(post.publishedAt);
  const isExternal = post.kind === "external" && Boolean(post.externalSource);

  return (
    <Link
      href={`/news/${post.slug}`}
      aria-label={`${post.title} — ${post.excerpt}`}
      className="group relative block border border-ink/12 bg-surface transition-colors duration-200 hover:border-primary/50"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <SanityImage
          image={post.coverImage}
          alt={post.coverImage?.alt || post.title}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px"
          className="transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />

        {isExternal && (
          <span className="absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 border border-white/25 bg-ink/70 px-2.5 py-1 font-heading text-[10px] font-medium uppercase tracking-[0.14em] text-white/90 backdrop-blur-sm">
            <ExternalLink size={11} strokeWidth={2} aria-hidden="true" />
            {post.externalSource}
          </span>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between gap-3">
          <CategoryChip category={post.category} />
          {date && (
            <time
              dateTime={post.publishedAt}
              className="font-heading text-[11px] font-medium uppercase tracking-[0.14em] text-ink/45"
            >
              {date}
            </time>
          )}
        </div>

        <h3 className="mt-4 font-heading text-lg font-semibold text-ink transition-colors duration-200 group-hover:text-primary">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-2 font-body text-sm leading-relaxed text-ink/65">
          {post.excerpt}
        </p>

        <div className="mt-5 flex items-center gap-1.5 border-t border-ink/8 pt-4 font-heading text-xs font-medium uppercase tracking-[0.08em] text-ink/70 transition-colors duration-200 group-hover:text-primary">
          {isExternal ? "Read coverage" : "Read article"}
          <ArrowRight
            size={13}
            strokeWidth={2}
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </div>
      </div>

      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-[2px] origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100"
      />
    </Link>
  );
}
