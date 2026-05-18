import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import JsonLd, { breadcrumbLd } from "@/components/seo/JsonLd";
import AboutHeader from "@/components/sections/AboutHeader";
import Vision, { type VisionItem } from "@/components/sections/Vision";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about.vision.meta" });
  return buildPageMetadata({
    locale,
    path: "/about/vision",
    title: t("title"),
    description: t("description"),
  });
}

export default async function VisionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [tVision, tNav, tIndex] = await Promise.all([
    getTranslations("about.vision"),
    getTranslations("nav"),
    getTranslations("about.index"),
  ]);

  const visionItems = tVision.raw("items") as ReadonlyArray<VisionItem>;

  return (
    <>
      <JsonLd
        id="ld-breadcrumb"
        data={breadcrumbLd({
          locale,
          trail: [
            { name: tNav("about"), path: "about" },
            { name: tIndex("cards.vision.title"), path: "about/vision" },
          ],
        })}
      />
      <AboutHeader
        overline={tVision("overline")}
        title={tVision("title")}
        subtitle={tVision("subtitle")}
      />
      <Vision
        overline={tVision("overline")}
        title={tVision("title")}
        subtitle={tVision("subtitle")}
        items={visionItems}
      />
    </>
  );
}
