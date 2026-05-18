import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import JsonLd, { aboutPageLd, breadcrumbLd } from "@/components/seo/JsonLd";
import AboutHeader from "@/components/sections/AboutHeader";
import AboutCardGrid from "@/components/sections/AboutCardGrid";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const tMeta = await getTranslations({ locale, namespace: "about.meta" });
  return buildPageMetadata({
    locale,
    path: "/about",
    title: "About Us",
    description: tMeta("description"),
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [tHeader, tIndex, tMeta, tNav] = await Promise.all([
    getTranslations("about.header"),
    getTranslations("about.index"),
    getTranslations("about.meta"),
    getTranslations("nav"),
  ]);

  return (
    <>
      <JsonLd id="ld-about" data={aboutPageLd(locale, tMeta("description"))} />
      <JsonLd
        id="ld-breadcrumb"
        data={breadcrumbLd({
          locale,
          trail: [{ name: tNav("about"), path: "about" }],
        })}
      />
      <AboutHeader
        overline={tHeader("overline")}
        title={tHeader("title")}
        subtitle={tHeader("subtitle")}
      />
      <AboutCardGrid
        overline={tIndex("overline")}
        title={tIndex("title")}
        cards={{
          ceo: {
            title: tIndex("cards.ceo.title"),
            description: tIndex("cards.ceo.description"),
          },
          history: {
            title: tIndex("cards.history.title"),
            description: tIndex("cards.history.description"),
          },
          vision: {
            title: tIndex("cards.vision.title"),
            description: tIndex("cards.vision.description"),
          },
          organization: {
            title: tIndex("cards.organization.title"),
            description: tIndex("cards.organization.description"),
          },
          clients: {
            title: tIndex("cards.clients.title"),
            description: tIndex("cards.clients.description"),
          },
        }}
      />
    </>
  );
}
