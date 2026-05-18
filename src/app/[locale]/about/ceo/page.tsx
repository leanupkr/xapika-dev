import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import JsonLd, { breadcrumbLd } from "@/components/seo/JsonLd";
import AboutHeader from "@/components/sections/AboutHeader";
import CeoMessage from "@/components/sections/CeoMessage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about.ceo.meta" });
  return buildPageMetadata({
    locale,
    path: "/about/ceo",
    title: t("title"),
    description: t("description"),
  });
}

export default async function CeoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [tCeo, tNav, tIndex] = await Promise.all([
    getTranslations("about.ceo"),
    getTranslations("nav"),
    getTranslations("about.index"),
  ]);

  return (
    <>
      <JsonLd
        id="ld-breadcrumb"
        data={breadcrumbLd({
          locale,
          trail: [
            { name: tNav("about"), path: "about" },
            { name: tIndex("cards.ceo.title"), path: "about/ceo" },
          ],
        })}
      />
      <AboutHeader
        overline={tCeo("overline")}
        title={tCeo("title")}
        subtitle={tCeo("subtitle")}
      />
      <CeoMessage
        overline={tCeo("overline")}
        title={tCeo("title")}
        subtitle={tCeo("subtitle")}
        placeholderName={tCeo("placeholderName")}
        awaitingNote={tCeo("awaitingNote")}
        portraitPlaceholder={tCeo("portraitPlaceholder")}
      />
    </>
  );
}
