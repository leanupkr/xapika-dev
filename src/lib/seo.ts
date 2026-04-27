import type { Metadata } from "next";

export const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://xapika.pl";

export const SITE_NAME = "Xapika Engineering";

export const LOCALES = ["en", "ko"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export function buildAlternates(locale: string, path: string) {
  const cleanPath = path.replace(/^\/+/, "");
  const suffix = cleanPath ? `/${cleanPath}` : "";
  const enUrl = `${BASE_URL}/en${suffix}`;
  const koUrl = `${BASE_URL}/ko${suffix}`;
  const canonical = `${BASE_URL}/${locale}${suffix}`;

  return {
    canonical,
    languages: {
      en: enUrl,
      ko: koUrl,
      "x-default": enUrl,
    },
  };
}

type OgInput = {
  locale: string;
  path: string;
  title: string;
  description: string;
  ogPath?: string;
};

export function buildOpenGraph({
  locale,
  path,
  title,
  description,
  ogPath,
}: OgInput): NonNullable<Metadata["openGraph"]> {
  const cleanPath = path.replace(/^\/+/, "");
  const suffix = cleanPath ? `/${cleanPath}` : "";
  const url = `${BASE_URL}/${locale}${suffix}`;
  const ogImageUrl = ogPath ? `${BASE_URL}${ogPath}` : `${BASE_URL}/opengraph-image`;

  return {
    type: "website",
    siteName: SITE_NAME,
    title,
    description,
    url,
    locale: locale === "ko" ? "ko_KR" : "en_US",
    alternateLocale: locale === "ko" ? ["en_US"] : ["ko_KR"],
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  };
}

export function buildTwitter({
  title,
  description,
  ogPath,
}: Pick<OgInput, "title" | "description" | "ogPath">): NonNullable<Metadata["twitter"]> {
  const ogImageUrl = ogPath ? `${BASE_URL}${ogPath}` : `${BASE_URL}/opengraph-image`;
  return {
    card: "summary_large_image",
    title,
    description,
    images: [ogImageUrl],
  };
}

export function buildPageMetadata(input: {
  locale: string;
  path: string;
  title: string;
  description: string;
  ogPath?: string;
}): Metadata {
  const { locale, path, title, description, ogPath } = input;
  return {
    title,
    description,
    alternates: buildAlternates(locale, path),
    openGraph: buildOpenGraph({ locale, path, title, description, ogPath }),
    twitter: buildTwitter({ title, description, ogPath }),
  };
}
