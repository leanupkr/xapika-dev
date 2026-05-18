import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import JsonLd, { breadcrumbLd } from "@/components/seo/JsonLd";
import AboutHeader from "@/components/sections/AboutHeader";
import OurClients from "@/components/sections/OurClients";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about.clients.meta" });
  return buildPageMetadata({
    locale,
    path: "/about/clients",
    title: t("title"),
    description: t("description"),
  });
}

export default async function ClientsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [tClients, tNav, tIndex] = await Promise.all([
    getTranslations("about.clients"),
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
            { name: tIndex("cards.clients.title"), path: "about/clients" },
          ],
        })}
      />
      <AboutHeader
        overline={tClients("overline")}
        title={tClients("title")}
        subtitle={tClients("subtitle")}
      />
      <OurClients
        overline={tClients("overline")}
        title={tClients("title")}
        subtitle={tClients("subtitle")}
        logoArrivingNote={tClients("logoArrivingNote")}
      />
    </>
  );
}
