import type { Metadata, Viewport } from "next";
import "./globals.css";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import { SITE_NAME, SITE_DISPLAY_NAME } from "@/lib/seo";
import { getRequestOrigin } from "@/lib/seo-host";
import { spaceGrotesk } from "@/app/fonts";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

export async function generateMetadata(): Promise<Metadata> {
  const origin = await getRequestOrigin();
  return {
    metadataBase: new URL(origin),
    title: {
      default: SITE_NAME,
      template: `%s — ${SITE_NAME}`,
    },
    description:
      "Xapika Engineering — Precision rail maintenance with uncompromised safety.",
    applicationName: SITE_DISPLAY_NAME,
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    openGraph: {
      type: "website",
      siteName: SITE_DISPLAY_NAME,
      locale: "en_US",
    },
    formatDetection: {
      email: false,
      telephone: false,
      address: false,
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0B1F3A" },
    { media: "(prefers-color-scheme: dark)", color: "#0B1F3A" },
  ],
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable}`}
      suppressHydrationWarning
    >
      {/*
        This layout deliberately renders nothing but <body> and the two Vercel
        scripts. The site chrome (skip link, Header, Footer, PageTransition,
        SiteJsonLd) lives in `(site)/layout.tsx` instead, so that routes
        outside that group — most importantly the embedded Sanity Studio at
        `/studio` — are not wrapped in it. Studio expects to own the full
        viewport; when it was nested inside `<main>` between the Header and
        Footer it rendered correctly but was squeezed to an unusable height.
        The `(site)` group is a route group, so no public URL changes.
      */}
      <body className="overflow-x-hidden">
        {children}

        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
