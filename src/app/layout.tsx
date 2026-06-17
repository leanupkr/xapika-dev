import type { Metadata, Viewport } from "next";
import "./globals.css";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import { SITE_NAME, SITE_DISPLAY_NAME } from "@/lib/seo";
import { getRequestOrigin } from "@/lib/seo-host";
import { spaceGrotesk } from "@/app/fonts";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/motion/PageTransition";
import SiteJsonLd from "@/components/seo/SiteJsonLd";

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
      <body className="overflow-x-hidden">
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

        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
