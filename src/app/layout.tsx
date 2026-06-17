import type { Metadata, Viewport } from "next";
import "./globals.css";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import { BASE_URL, SITE_NAME, SITE_DISPLAY_NAME } from "@/lib/seo";
import { spaceGrotesk } from "@/app/fonts";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/motion/PageTransition";
import JsonLd, {
  organizationLd,
  websiteLd,
  siteNavigationLd,
} from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
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
    locale: "ko_KR",
  },
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
};

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
      lang="ko"
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

        <JsonLd id="ld-organization" data={organizationLd()} />
        <JsonLd id="ld-website" data={websiteLd()} />
        <JsonLd id="ld-navigation" data={siteNavigationLd()} />
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
