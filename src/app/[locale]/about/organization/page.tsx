import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import JsonLd, { breadcrumbLd } from "@/components/seo/JsonLd";
import AboutHeader from "@/components/sections/AboutHeader";
import OrgChart from "@/components/sections/OrgChart";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about.org.meta" });
  return buildPageMetadata({
    locale,
    path: "/about/organization",
    title: t("title"),
    description: t("description"),
  });
}

export default async function OrganizationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [tOrg, tNav, tIndex] = await Promise.all([
    getTranslations("about.org"),
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
            { name: tIndex("cards.organization.title"), path: "about/organization" },
          ],
        })}
      />
      <AboutHeader
        overline={tOrg("overline")}
        title={tOrg("title")}
        subtitle={tOrg("subtitle")}
      />
      <OrgChart
        overline={tOrg("overline")}
        title={tOrg("title")}
        subtitle={tOrg("subtitle")}
        placeholderText={tOrg("placeholderText")}
        awaitingNote={tOrg("awaitingNote")}
      />
    </>
  );
}
