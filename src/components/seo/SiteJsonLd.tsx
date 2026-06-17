import { getRequestOrigin, PL_ORIGIN, hostSiteUrl } from "@/lib/seo-host";
import { SITE_NAME, SITE_DISPLAY_NAME } from "@/lib/seo";
import { NAV_ITEMS } from "@/data/nav";
import JsonLd from "./JsonLd";

export default async function SiteJsonLd() {
  const origin = await getRequestOrigin();
  // @id is always PL_ORIGIN — entity identity must be stable across domains
  const orgId = `${PL_ORIGIN}/#organization`;
  const siteId = `${PL_ORIGIN}/#website`;

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": orgId,
    name: SITE_DISPLAY_NAME,
    alternateName: SITE_NAME,
    url: hostSiteUrl(origin),
    logo: `${origin}/logo.png`,
    description:
      "Precision rail maintenance with uncompromised safety — operations across Poland, Ukraine, Türkiye, USA, South Korea, and Uzbekistan.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Warsaw",
      addressCountry: "PL",
    },
    sameAs: [],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": siteId,
    url: hostSiteUrl(origin),
    name: SITE_DISPLAY_NAME,
    alternateName: SITE_NAME,
    inLanguage: "en-US",
    publisher: { "@id": orgId },
  };

  const items = NAV_ITEMS.map(
    (item: { href: string; label: string }, i: number) => ({
      "@type": "SiteNavigationElement",
      position: i + 1,
      name: item.label,
      url: hostSiteUrl(origin, item.href),
    }),
  );
  const navigation = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${origin}/#nav`,
    itemListElement: items,
  };

  return (
    <>
      <JsonLd id="ld-organization" data={organization} />
      <JsonLd id="ld-website" data={website} />
      <JsonLd id="ld-navigation" data={navigation} />
    </>
  );
}
