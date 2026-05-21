import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import JsonLd, { breadcrumbLd } from "@/components/seo/JsonLd";
import AboutHeader from "@/components/sections/AboutHeader";
import ContactInfo from "@/components/sections/ContactInfo";
import ContactInteractive from "@/components/contact/ContactInteractive";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const tMeta = await getTranslations({
    locale,
    namespace: "contactPage.meta",
  });
  return buildPageMetadata({
    locale,
    path: "/contact",
    title: "Contact",
    description: tMeta("description"),
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [tHeader, tInfo, tNav] = await Promise.all([
    getTranslations("contactPage.header"),
    getTranslations("contactPage.info"),
    getTranslations("nav"),
  ]);

  return (
    <>
      <JsonLd
        id="ld-breadcrumb"
        data={breadcrumbLd({
          locale,
          trail: [{ name: tNav("contact"), path: "contact" }],
        })}
      />
      <AboutHeader
        overline={tHeader("overline")}
        title={tHeader("title")}
        subtitle={tHeader("subtitle")}
      />
      <ContactInteractive
        contactInfoSlot={
          <ContactInfo
            overline={tInfo("overline")}
            hqLabel={tInfo("hq")}
            hqValue={tInfo("hqValue")}
            hoursLabel={tInfo("hours")}
            officeLink={tInfo("officeLink")}
            openInMaps={tInfo("openInMaps")}
          />
        }
      />
    </>
  );
}
