import { BASE_URL, SITE_NAME } from "@/lib/seo";

type JsonLdProps = {
  data: Record<string, unknown> | ReadonlyArray<Record<string, unknown>>;
  id?: string;
};

export default function JsonLd({ data, id }: JsonLdProps) {
  const json = JSON.stringify(data);
  return (
    <script
      type="application/ld+json"
      id={id}
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}

export function organizationLd(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BASE_URL}/#organization`,
    name: SITE_NAME,
    url: `${BASE_URL}/${locale}`,
    logo: `${BASE_URL}/logo.png`,
    description:
      "Precision rail maintenance with uncompromised safety — operations across Poland, Ukraine, Türkiye, Brazil, USA, Egypt, Korea, and Uzbekistan.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Warsaw",
      addressCountry: "PL",
    },
    sameAs: [],
  };
}

export function websiteLd(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    url: `${BASE_URL}/${locale}`,
    name: SITE_NAME,
    inLanguage: locale === "ko" ? "ko-KR" : "en-US",
    publisher: { "@id": `${BASE_URL}/#organization` },
  };
}

export function aboutPageLd(locale: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    url: `${BASE_URL}/${locale}/about`,
    name: `About — ${SITE_NAME}`,
    description,
    inLanguage: locale === "ko" ? "ko-KR" : "en-US",
    mainEntity: { "@id": `${BASE_URL}/#organization` },
  };
}

export function serviceLd(input: {
  locale: string;
  slug: string;
  name: string;
  description: string;
}) {
  const { locale, slug, name, description } = input;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: `${BASE_URL}/${locale}/solutions/${slug}`,
    provider: { "@id": `${BASE_URL}/#organization` },
    serviceType: "Rail maintenance",
    areaServed: ["Poland", "Ukraine", "Turkey", "Brazil", "USA", "Egypt", "Korea", "Uzbekistan"],
  };
}

export function caseStudyLd(input: {
  locale: string;
  slug: string;
  name: string;
  description: string;
  country: string;
}) {
  const { locale, slug, name, description, country } = input;
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${BASE_URL}/${locale}/portfolios/${slug}`,
    name,
    description,
    url: `${BASE_URL}/${locale}/portfolios/${slug}`,
    creator: { "@id": `${BASE_URL}/#organization` },
    contentLocation: { "@type": "Place", name: country },
    inLanguage: locale === "ko" ? "ko-KR" : "en-US",
  };
}

type OfficeInput = {
  city: string;
  country: string;
  role: "headquarters" | "office" | "warehouse";
  lat: number;
  lng: number;
};

export function placesLd(offices: ReadonlyArray<OfficeInput>) {
  return offices.map((o) => ({
    "@context": "https://schema.org",
    "@type": o.role === "headquarters" ? "Organization" : "Place",
    name: `${SITE_NAME} — ${o.city}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: o.city,
      addressCountry: o.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: o.lat,
      longitude: o.lng,
    },
  }));
}
