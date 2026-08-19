import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestOrigin } from "@/lib/seo-host";
import JsonLd, { breadcrumbLd } from "@/components/seo/JsonLd";
import { newsArticleLd } from "@/lib/newsLd";
import { sanityFetch } from "@/sanity/fetch";
import { newsBySlugQuery, newsSlugsQuery } from "@/sanity/queries";
import type { NewsPost } from "@/sanity/types";
import NewsHero from "@/components/sections/NewsHero";
import NewsBody from "@/components/sections/NewsBody";
import NewsGallery from "@/components/sections/NewsGallery";
import NewsExternalPanel from "@/components/sections/NewsExternalPanel";
import NewsLangToggle from "@/components/sections/NewsLangToggle";
import RelatedNews from "@/components/sections/RelatedNews";

// Webhook-driven revalidation (see src/app/api/revalidate) is the primary
// path; this is only the safety net if a webhook delivery is ever missed.
export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const slugs = await sanityFetch<{ slug: string }[]>({
      query: newsSlugsQuery,
      tags: ["news"],
    });
    return slugs.map((s) => ({ slug: s.slug }));
  } catch (err) {
    // Sanity project doesn't exist yet at build time (and could also be a
    // transient error later) — never fail `next build` for the other routes
    // over this. `dynamicParams` defaults to true, so real slugs still
    // render on demand once content exists.
    console.error("[news] generateStaticParams failed, falling back to []", err);
    return [];
  }
}

export const dynamicParams = true;

// sanityFetch() always throws on failure (see src/sanity/fetch.ts's
// documented contract) — never returns a fallback itself. Per that
// contract, a detail page's fallback is notFound(), so every call site
// here catches and normalizes to `null`.
async function getPost(slug: string): Promise<NewsPost | null> {
  try {
    return await sanityFetch<NewsPost | null>({
      query: newsBySlugQuery,
      params: { slug },
      tags: ["news", `news:${slug}`],
    });
  } catch (err) {
    console.error("[news] detail fetch failed", err);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [origin, post] = await Promise.all([getRequestOrigin(), getPost(slug)]);

  if (!post) {
    return buildPageMetadata({
      origin,
      path: `/news/${slug}`,
      title: "News — Xapika Engineering",
      description: "Company announcements, project milestones, and press coverage.",
    });
  }

  return buildPageMetadata({
    origin,
    path: `/news/${slug}`,
    title: post.seoTitle ?? `${post.title} — Xapika Engineering`,
    description: post.seoDescription ?? post.excerpt,
  });
}

export default async function NewsDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const { slug } = await params;
  const [{ lang: langParam }, origin, post] = await Promise.all([
    searchParams,
    getRequestOrigin(),
    getPost(slug),
  ]);
  if (!post) notFound();

  // Korean toggle (NEWS_CMS_PLAN.md §5 decision a): `?lang=ko` only actually
  // shows KO copy on articles that have a Korean translation filled in.
  const showKo = langParam === "ko" && Boolean(post.titleKo);
  const title = showKo ? (post.titleKo ?? post.title) : post.title;
  const excerpt = showKo ? (post.excerptKo ?? post.excerpt) : post.excerpt;
  const body = showKo ? (post.bodyKo ?? post.body) : post.body;

  return (
    <>
      <JsonLd
        id="ld-breadcrumb"
        data={breadcrumbLd(origin, {
          trail: [
            { name: "News", path: "news" },
            { name: post.title, path: `news/${slug}` },
          ],
        })}
      />
      <JsonLd
        id="ld-news-article"
        data={newsArticleLd(origin, {
          slug,
          kind: post.kind,
          title: post.title,
          excerpt: post.excerpt,
          publishedAt: post.publishedAt,
          coverImage: post.coverImage,
          externalUrl: post.externalUrl,
        })}
      />

      <NewsHero
        category={post.category}
        title={title}
        publishedAt={post.publishedAt}
        coverImage={post.coverImage}
        langToggle={
          post.titleKo ? (
            <NewsLangToggle slug={slug} currentLang={showKo ? "ko" : "en"} />
          ) : null
        }
      />

      {post.kind === "own" && body && body.length > 0 ? (
        <NewsBody body={body} />
      ) : null}

      {post.kind === "own" && post.gallery && post.gallery.length > 0 ? (
        <NewsGallery images={post.gallery} />
      ) : null}

      {post.kind === "external" ? (
        <NewsExternalPanel
          excerpt={excerpt}
          externalUrl={post.externalUrl}
          externalSource={post.externalSource}
        />
      ) : null}

      <RelatedNews currentSlug={slug} currentCategory={post.category} />
    </>
  );
}
