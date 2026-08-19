import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { sanityFetch } from "@/sanity/fetch";
import { newsListQuery } from "@/sanity/queries";
import type { NewsCardData } from "@/sanity/types";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionOverline from "@/components/ui/SectionOverline";
import SanityImage from "@/components/ui/SanityImage";
import CategoryChip from "@/components/ui/CategoryChip";

function formatPublishedDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

async function getPosts(): Promise<NewsCardData[]> {
  try {
    return await sanityFetch<NewsCardData[]>({ query: newsListQuery, tags: ["news"] });
  } catch (err) {
    // Sanity project not configured yet, or a transient fetch failure —
    // the homepage must still build/render without a News section.
    console.error("[news] home preview fetch failed", err);
    return [];
  }
}

function NewsCard({ post }: { post: NewsCardData }) {
  const isExternal = post.kind === "external" && Boolean(post.externalSource);
  const date = formatPublishedDate(post.publishedAt);

  return (
    <Link
      href={`/news/${post.slug}`}
      className="group block border border-ink/15 transition-colors duration-300 hover:border-primary"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <SanityImage
          image={post.coverImage}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />

        {/* Same external-coverage badge as the /news list cards — a reader
            who sees a card here and again on /news must not have to
            re-learn which posts link out to a third-party publication. */}
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
        <h3 className="mt-3 font-heading text-lg font-semibold text-ink line-clamp-2">
          {post.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink/70 line-clamp-2">
          {post.excerpt}
        </p>
      </div>
    </Link>
  );
}

export default async function NewsPreview() {
  const posts = await getPosts();

  // Required guard — this is the expected state right after launch (no
  // posts published yet), so the section must not render at all rather
  // than show an empty grid.
  if (posts.length === 0) return null;

  const featured = posts.slice(0, 3);

  return (
    <section
      data-bg="light"
      className="relative py-14 md:py-20 lg:py-24"
      style={{ backgroundColor: "#fafbfc" }}
      aria-labelledby="news-preview-title"
    >
      <SectionContainer>
        <div className="mb-12 flex flex-col gap-8 sm:mb-16 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <SectionOverline>News</SectionOverline>
            <h2
              id="news-preview-title"
              className="font-heading font-semibold"
              style={{
                fontSize: "clamp(2rem, 4vw, 3rem)",
                color: "rgb(var(--color-ink))",
                letterSpacing: "-0.02em",
                lineHeight: 1.08,
              }}
            >
              Latest from the newsroom.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink/60">
              Announcements, project milestones, and press coverage — as they happen.
            </p>
          </div>

          <Link
            href="/news"
            className="group inline-flex flex-shrink-0 items-center gap-2 whitespace-nowrap border border-ink/15 px-6 py-3.5 font-heading text-sm font-medium text-ink transition-colors duration-300 hover:border-primary hover:text-primary"
          >
            View all news
            <ArrowUpRight
              size={16}
              strokeWidth={2}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
          {featured.map((post) => (
            <NewsCard key={post._id} post={post} />
          ))}
        </div>
      </SectionContainer>
    </section>
  );
}
