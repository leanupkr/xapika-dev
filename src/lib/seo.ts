import type { Metadata } from "next";

export const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://xapika-dev.vercel.app";

export const SITE_NAME = "Xapika Engineering";

export function siteUrl(path: string = ""): string {
  const cleanPath = path.replace(/^\/+/, "");
  return cleanPath ? `${BASE_URL}/${cleanPath}` : BASE_URL;
}

export function buildAlternates(path: string) {
  const url = siteUrl(path);
  return {
    canonical: url,
    languages: {
      en: url,
      "x-default": url,
    },
  };
}

type OgInput = {
  path: string;
  title: string;
  description: string;
  ogPath?: string;
};

export function buildOpenGraph({
  path,
  title,
  description,
  ogPath,
}: OgInput): NonNullable<Metadata["openGraph"]> {
  const url = siteUrl(path);

  const og: NonNullable<Metadata["openGraph"]> = {
    type: "website",
    siteName: SITE_NAME,
    title,
    description,
    url,
    locale: "en_US",
  };

  if (ogPath) {
    og.images = [
      {
        url: `${BASE_URL}${ogPath}`,
        width: 1200,
        height: 630,
        alt: title,
      },
    ];
  }

  return og;
}

export function buildTwitter({
  title,
  description,
  ogPath,
}: Pick<OgInput, "title" | "description" | "ogPath">): NonNullable<Metadata["twitter"]> {
  const twitter: NonNullable<Metadata["twitter"]> = {
    card: "summary_large_image",
    title,
    description,
  };

  if (ogPath) {
    twitter.images = [`${BASE_URL}${ogPath}`];
  }

  return twitter;
}

export function buildPageMetadata(input: {
  path: string;
  title: string;
  description: string;
  ogPath?: string;
}): Metadata {
  const { path, title, description, ogPath } = input;
  return {
    title,
    description,
    alternates: buildAlternates(path),
    openGraph: buildOpenGraph({ path, title, description, ogPath }),
    twitter: buildTwitter({ title, description, ogPath }),
  };
}
