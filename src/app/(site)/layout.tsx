import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/motion/PageTransition";
import SiteJsonLd from "@/components/seo/SiteJsonLd";

/**
 * Site chrome — everything the public pages share.
 *
 * This used to live in the root layout, but the embedded Sanity Studio at
 * `/studio` needs the whole viewport: nested inside `<main>` between the
 * Header and Footer it still mounted and rendered (its login screen was in
 * the DOM), it was just squeezed into an unusable sliver of height. Moving
 * the chrome down into this route group keeps `/studio` — and any future
 * full-screen or headless route — out of it.
 *
 * `(site)` is a route group: it groups files for layout purposes only and
 * contributes nothing to the URL, so every public path is unchanged.
 */
export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[9999] focus:left-4 focus:top-4 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:font-medium focus:rounded focus:shadow-lg"
      >
        Skip to content
      </a>

      <SiteJsonLd />
      <PageTransition />
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  );
}
