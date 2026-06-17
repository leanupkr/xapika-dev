import type { Metadata } from "next";
import { buildHostAlternates } from "./seo-host";

export const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://xapika.pl"; // updated default to PL (primary brand)

export const SITE_NAME = "Xapika Engineering";

/**
 * Site name shown by Google as the result's display name (the small grey
 * line above the title). Kept short/brand-only so Search shows "XAPIKA"
 * instead of the bare domain. SITE_NAME stays the full legal brand for titles.
 */
export const SITE_DISPLAY_NAME = "XAPIKA";

/** @deprecated Use hostSiteUrl() from seo-host.ts inside generateMetadata.
 *  Kept for email templates and non-request-time contexts only. */
export function siteUrl(path: string = ""): string {
  const cleanPath = path.replace(/^\/+/, "");
  return cleanPath ? `${BASE_URL}/${cleanPath}` : BASE_URL;
}

type PageMetadataInput = {
  origin: string; // pass result of await getRequestOrigin() here
  path: string; // e.g. '/about' or '' for home
  title: string;
  description: string;
  ogPath?: string;
};

function buildOpenGraph(
  origin: string,
  path: string,
  title: string,
  description: string,
  ogPath?: string,
): NonNullable<Metadata["openGraph"]> {
  const cleanPath = path.replace(/^\/+/, "");
  const url = cleanPath ? `${origin}/${cleanPath}` : origin;
  const og: NonNullable<Metadata["openGraph"]> = {
    type: "website",
    siteName: SITE_DISPLAY_NAME,
    title,
    description,
    url,
    locale: "en_US", // site is English-language
  };
  if (ogPath) {
    og.images = [
      { url: `${origin}${ogPath}`, width: 1200, height: 630, alt: title },
    ];
  }
  return og;
}

function buildTwitter(
  origin: string,
  title: string,
  description: string,
  ogPath?: string,
): NonNullable<Metadata["twitter"]> {
  const twitter: NonNullable<Metadata["twitter"]> = {
    card: "summary_large_image",
    title,
    description,
  };
  if (ogPath) {
    twitter.images = [`${origin}${ogPath}`];
  }
  return twitter;
}

export function buildPageMetadata(input: PageMetadataInput): Metadata {
  const { origin, path, title, description, ogPath } = input;
  return {
    title,
    description,
    alternates: buildHostAlternates(origin, path),
    openGraph: buildOpenGraph(origin, path, title, description, ogPath),
    twitter: buildTwitter(origin, title, description, ogPath),
  };
}
