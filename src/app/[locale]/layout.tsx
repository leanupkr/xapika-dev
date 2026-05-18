import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { routing } from "@/i18n/routing";
import { inter, spaceGrotesk } from "@/app/fonts";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/motion/PageTransition";
import JsonLd, { organizationLd, websiteLd } from "@/components/seo/JsonLd";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${spaceGrotesk.variable}`}
      suppressHydrationWarning
    >
      <body>
        {/* Skip-to-content link — first focusable element, visually hidden until focused */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[9999] focus:left-4 focus:top-4 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:font-medium focus:rounded focus:shadow-lg"
        >
          {locale === "ko" ? "본문으로 건너뛰기" : "Skip to content"}
        </a>

        <NextIntlClientProvider locale={locale} messages={messages}>
          <JsonLd id="ld-organization" data={organizationLd(locale)} />
          <JsonLd id="ld-website" data={websiteLd(locale)} />
          <PageTransition />
          <Header />
          <main id="main-content">{children}</main>
          <Footer />
        </NextIntlClientProvider>

        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
