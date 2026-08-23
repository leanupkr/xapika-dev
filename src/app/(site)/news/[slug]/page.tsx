import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestOrigin } from "@/lib/seo-host";
import JsonLd, { breadcrumbLd } from "@/components/seo/JsonLd";
import { newsArticleLd } from "@/lib/newsLd";
import { sanityFetch } from "@/sanity/fetch";
import { newsBySlugQuery } from "@/sanity/queries";
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

// No generateStaticParams here, on purpose.
//
// Every page under (site) is request-time dynamic by construction: the root
// layout's generateMetadata calls getRequestOrigin(), and so does
// SiteJsonLd in (site)/layout.tsx. Both read headers(), because the site is
// host-aware — xapika.pl and xapika.co.kr serve the same pages with their
// own canonical/og:url values. A route whose layout reads headers() can
// never be statically generated.
//
// Declaring generateStaticParams anyway told Next to try, and the attempt
// threw DYNAMIC_SERVER_USAGE the moment it rendered — then *cached the
// failure*, so xapika.pl/news/<any-unknown-slug> served a 500 from the CDN
// where it should have served a 404. It only surfaced in production
// because an empty dataset made the param list empty, which is what makes
// Next build the fallback shell; the dev deployment had articles and so
// never built one. Removing it makes the route honestly dynamic, which is
// what it already was in every build before this (`ƒ /news/[slug]`), and
// costs nothing: with no static params there was never any prerendered
// page to lose.

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

  // Deliberately NOT Promise.all'd with getRequestOrigin(). getRequestOrigin
  // reads headers(), and a request for a slug that doesn't exist must reach
  // notFound() without ever touching a dynamic API — see the matching
  // comment in NewsDetailPage below for the 500 this ordering fixes.
  const post = await getPost(slug);

  if (!post) {
    // No origin, no headers(): the page is about to render a 404, and none
    // of the host-aware metadata (canonical, og:url, hreflang alternates)
    // would be used for it anyway.
    return {
      title: "News",
      description: "Company announcements, project milestones, and press coverage.",
    };
  }

  return buildPageMetadata({
    origin: await getRequestOrigin(),
    path: `/news/${slug}`,
    // No brand suffix here — the root layout's title.template appends it.
    // `seoTitle` is the editor's own override and is used verbatim.
    title: post.seoTitle ?? post.title,
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

  // Order matters, and this is why it is not one Promise.all.
  //
  // getRequestOrigin() reads headers(). generateStaticParams above returns
  // [] whenever the dataset has no articles yet — which is exactly the
  // state a freshly launched production site is in — and Next then
  // prerenders this route's fallback at build time. Calling headers()
  // inside that prerender throws DYNAMIC_SERVER_USAGE, and because the
  // failure happens during generation it gets *cached*: xapika.pl/news/
  // <any-slug> answered 500 instead of 404, from the CDN, until the next
  // deploy. (Confirmed from the Vercel runtime log: digest
  // "DYNAMIC_SERVER_USAGE" on /news/no-such-article.) It did not reproduce
  // on the dev deployment because that dataset had articles, so
  // generateStaticParams returned real slugs and no fallback was built.
  //
  // Fetching the post first means a missing article short-circuits to
  // notFound() before any dynamic API is touched, so the 404 is a plain
  // static 404 no matter how the route is being rendered.
  const post = await getPost(slug);
  if (!post) notFound();

  const [{ lang: langParam }, origin] = await Promise.all([
    searchParams,
    getRequestOrigin(),
  ]);

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

      {/* The root <html lang> is fixed at "en" (the site is English-only),
          but this block swaps to Korean copy when ?lang=ko resolves. A
          nested lang attribute is the standard way to say "this subtree is
          in another language" — without it a screen reader announces the
          Korean text with English pronunciation rules. Scoped to the
          article itself: RelatedNews below always renders English titles. */}
      <div lang={showKo ? "ko" : "en"}>
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
      </div>

      <RelatedNews currentSlug={slug} currentCategory={post.category} />
    </>
  );
}
