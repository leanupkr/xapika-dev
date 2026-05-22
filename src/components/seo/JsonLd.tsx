import { BASE_URL, SITE_NAME, siteUrl } from "@/lib/seo";

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

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BASE_URL}/#organization`,
    name: SITE_NAME,
    url: siteUrl(),
    logo: `${BASE_URL}/logo.png`,
    description:
      "Precision rail maintenance with uncompromised safety — operations across Poland, Ukraine, Türkiye, Brazil, USA, Egypt, Republic of Korea, and Uzbekistan.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Warsaw",
      addressCountry: "PL",
    },
    sameAs: [],
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    url: siteUrl(),
    name: SITE_NAME,
    inLanguage: "en-US",
    publisher: { "@id": `${BASE_URL}/#organization` },
  };
}

export function aboutPageLd(description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    url: siteUrl("about"),
    name: `About — ${SITE_NAME}`,
    description,
    inLanguage: "en-US",
    mainEntity: { "@id": `${BASE_URL}/#organization` },
  };
}

export function serviceLd(input: {
  slug: string;
  name: string;
  description: string;
}) {
  const { slug, name, description } = input;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: siteUrl(`solutions/${slug}`),
    provider: { "@id": `${BASE_URL}/#organization` },
    serviceType: "Rail maintenance",
    areaServed: ["Poland", "Ukraine", "Türkiye", "Brazil", "USA", "Egypt", "Republic of Korea", "Uzbekistan"],
  };
}

export function caseStudyLd(input: {
  slug: string;
  name: string;
  description: string;
  country: string;
}) {
  const { slug, name, description, country } = input;
  const url = siteUrl(`portfolios/${slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": url,
    name,
    description,
    url,
    creator: { "@id": `${BASE_URL}/#organization` },
    contentLocation: { "@type": "Place", name: country },
    inLanguage: "en-US",
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
  path: string;
};

export function breadcrumbLd(input: {
  trail: ReadonlyArray<BreadcrumbItem>;
}) {
  const { trail } = input;
  const home: BreadcrumbItem = {
    name: "Home",
    path: "",
  };
  const items = [home, ...trail].map((crumb, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: crumb.name,
    item: siteUrl(crumb.path),
  }));
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
}
