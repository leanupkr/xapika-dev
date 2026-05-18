import { BASE_URL, SITE_NAME, localeUrl } from "@/lib/seo";

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
    url: localeUrl(locale),
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
    url: localeUrl(locale),
    name: SITE_NAME,
    inLanguage: locale === "ko" ? "ko-KR" : "en-US",
    publisher: { "@id": `${BASE_URL}/#organization` },
  };
}

export function aboutPageLd(locale: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    url: localeUrl(locale, "about"),
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
    url: localeUrl(locale, `solutions/${slug}`),
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
  const url = localeUrl(locale, `portfolios/${slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": url,
    name,
    description,
    url,
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

type BreadcrumbItem = {
  name: string;
  /** Slug or path segment appended after the locale (e.g. "about" or "solutions/heavy-maintenance"). Omit on the final crumb if it should be the current page. */
  path: string;
};

export function breadcrumbLd(input: {
  locale: string;
  trail: ReadonlyArray<BreadcrumbItem>;
}) {
  const { locale, trail } = input;
  const home: BreadcrumbItem = {
    name: locale === "ko" ? "홈" : "Home",
    path: "",
  };
  const items = [home, ...trail].map((crumb, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: crumb.name,
    item: localeUrl(locale, crumb.path),
  }));
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
}
