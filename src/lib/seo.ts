import type { Metadata } from "next";

export const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://xapika.pl";

export const SITE_NAME = "Xapika Engineering";

export const LOCALES = ["en", "ko"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/**
 * 절대 URL을 생성한다.
 * `localePrefix: 'never'` 정책에 따라 모든 locale이 동일 URL을 공유.
 * locale 인자는 시그니처 호환성을 위해 받지만 URL에는 반영하지 않는다.
 */
export function localeUrl(_locale: string, path: string = ""): string {
  const cleanPath = path.replace(/^\/+/, "");
  return cleanPath ? `${BASE_URL}/${cleanPath}` : BASE_URL;
}

export function buildAlternates(_locale: string, path: string) {
  const url = localeUrl(_locale, path);
  // 모든 locale이 같은 URL이므로 alternates는 동일. hreflang은 cookie 기반 분기 안내용.
  return {
    canonical: url,
    languages: {
      en: url,
      ko: url,
      "x-default": url,
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
  const url = localeUrl(locale, path);
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
