import { headers } from "next/headers";

export const PL_ORIGIN = "https://xapika.pl";
export const KR_ORIGIN = "https://xapika.co.kr";

/**
 * Derives the request origin from the Host header at request time.
 * Returns PL_ORIGIN for xapika.pl (and localhost/unknown — PL is the primary brand).
 * Returns KR_ORIGIN only when the bare host ends in xapika.co.kr.
 */
export async function getRequestOrigin(): Promise<string> {
  const host = (await headers()).get("host") ?? "";
  const bare = host.split(":")[0]; // strip optional port (local dev)
  return bare === "xapika.co.kr" || bare.endsWith(".xapika.co.kr")
    ? KR_ORIGIN
    : PL_ORIGIN;
}

/**
 * Builds a fully reciprocal hreflang cluster for a given path and request origin.
 * Every page calls this so both domains carry the complete cluster (Google requirement).
 */
export function buildHostAlternates(
  origin: string,
  path: string,
): {
  canonical: string;
  languages: Record<string, string>;
} {
  const cleanPath = path.replace(/^\/+/, "");
  const plUrl = cleanPath ? `${PL_ORIGIN}/${cleanPath}` : PL_ORIGIN;
  const krUrl = cleanPath ? `${KR_ORIGIN}/${cleanPath}` : KR_ORIGIN;
  const selfUrl = cleanPath ? `${origin}/${cleanPath}` : origin;
  return {
    canonical: selfUrl, // self-canonical (differs per host)
    languages: {
      "en-PL": plUrl,
      "en-KR": krUrl,
      "x-default": plUrl, // HQ/Warsaw is the global default
    },
  };
}

/**
 * Builds a host-aware absolute URL for a given path.
 * Replaces siteUrl() in host-dependent contexts.
 */
export function hostSiteUrl(origin: string, path: string = ""): string {
  const cleanPath = path.replace(/^\/+/, "");
  return cleanPath ? `${origin}/${cleanPath}` : origin;
}
