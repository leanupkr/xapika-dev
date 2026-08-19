"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, ExternalLink, Newspaper } from "lucide-react";
import { EASE } from "@/lib/motion";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { cn } from "@/lib/cn";
import SectionContainer from "@/components/ui/SectionContainer";
import SanityImage from "@/components/ui/SanityImage";
import CategoryChip from "@/components/ui/CategoryChip";
import type { NewsCardData, NewsCategory } from "@/sanity/types";

const PAGE_SIZE = 9;

const CATEGORY_ORDER: NewsCategory[] = [
  "company-news",
  "project-update",
  "press-release",
  "media-coverage",
];

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

type NewsIndexProps = {
  posts: NewsCardData[];
};

/**
 * `/news` list body — category filter chips + card grid + "Load more".
 * Client component because filtering/pagination are local interaction state;
 * the post data itself is fetched server-side and passed down as props.
 */
export default function NewsIndex({ posts }: NewsIndexProps) {
  const [activeCategory, setActiveCategory] = useState<NewsCategory | "all">(
    "all",
  );
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  const availableCategories = useMemo(
    () => CATEGORY_ORDER.filter((cat) => posts.some((p) => p.category === cat)),
    [posts],
  );

  const filteredPosts = useMemo(
    () =>
      activeCategory === "all"
        ? posts
        : posts.filter((p) => p.category === activeCategory),
    [posts, activeCategory],
  );

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;

  function handleCategoryChange(next: NewsCategory | "all") {
    setActiveCategory(next);
    setVisibleCount(PAGE_SIZE);
  }

  return (
    <SectionContainer className="py-[clamp(80px,10vw,140px)]">
      <div className="mb-8 font-mono text-sm text-ink/50">
        Published — {String(posts.length).padStart(2, "0")}
      </div>

      {posts.length === 0 ? (
        <div className="flex flex-col items-center gap-4 border border-dashed border-ink/20 px-6 py-20 text-center">
          <Newspaper
            size={28}
            strokeWidth={1.5}
            aria-hidden="true"
            className="text-ink/25"
          />
          <p className="font-heading text-base font-medium text-ink/60">
            The newsroom is just getting started.
          </p>
        </div>
      ) : (
        <>
          {/* Category filters — mobile: horizontal scroll bleeding to the
              section edges (matches SectionContainer's own px-6); sm+: wraps. */}
          <div className="-mx-6 mb-10 flex gap-2 overflow-x-auto px-6 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
            <CategoryChip
              category="all"
              as="button"
              active={activeCategory === "all"}
              onClick={() => handleCategoryChange("all")}
            />
            {availableCategories.map((cat) => (
              <CategoryChip
                key={cat}
                category={cat}
                as="button"
                active={activeCategory === cat}
                onClick={() => handleCategoryChange(cat)}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
            {visiblePosts.map((post, i) => (
              <NewsCard
                key={post._id}
                post={post}
                index={i}
                reducedMotion={reducedMotion}
              />
            ))}
          </div>

          {hasMore && (
            <div className="mt-12 flex justify-center sm:mt-16">
              <button
                type="button"
                onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
                className="group inline-flex min-h-[44px] items-center gap-2 border border-ink/15 bg-surface px-6 font-heading text-sm font-medium text-ink transition-colors duration-200 hover:border-primary hover:text-primary"
              >
                Load more
                <ChevronDown
                  size={16}
                  strokeWidth={2}
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-y-0.5"
                />
              </button>
            </div>
          )}
        </>
      )}
    </SectionContainer>
  );
}

function NewsCard({
  post,
  index,
  reducedMotion,
}: {
  post: NewsCardData;
  index: number;
  reducedMotion: boolean;
}) {
  const isFeatured = post.featured;
  const date = formatPublishedDate(post.publishedAt);
  const isExternal = post.kind === "external" && Boolean(post.externalSource);

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 24 }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.6,
        delay: reducedMotion ? 0 : Math.min(index, 6) * 0.06,
        ease: EASE,
      }}
      className={isFeatured ? "sm:col-span-2 lg:col-span-3" : undefined}
    >
      <Link
        href={`/news/${post.slug}`}
        aria-label={`${post.title} — ${post.excerpt}`}
        className="group relative block border border-ink/12 bg-surface transition-colors duration-200 hover:border-primary/50"
      >
        <div
          className={cn(
            "relative w-full overflow-hidden",
            isFeatured ? "aspect-[4/3] sm:aspect-[21/9]" : "aspect-[16/10]",
          )}
        >
          <SanityImage
            image={post.coverImage}
            alt={post.coverImage?.alt || post.title}
            sizes={
              isFeatured
                ? "(max-width: 640px) 100vw, 1200px"
                : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px"
            }
            className="transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />

          {/* External-coverage badge — visually separates link-out press
              coverage from self-written articles right on the card. */}
          {isExternal && (
            <span className="absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 border border-white/25 bg-ink/70 px-2.5 py-1 font-heading text-[10px] font-medium uppercase tracking-[0.14em] text-white/90 backdrop-blur-sm">
              <ExternalLink size={11} strokeWidth={2} aria-hidden="true" />
              {post.externalSource}
            </span>
          )}
        </div>

        <div className={isFeatured ? "p-6 sm:p-8" : "p-6"}>
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

          <h3
            className={cn(
              "mt-4 font-heading font-semibold text-ink transition-colors duration-200 group-hover:text-primary",
              isFeatured ? "text-xl sm:text-2xl" : "text-lg",
            )}
          >
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
    </motion.div>
  );
}
