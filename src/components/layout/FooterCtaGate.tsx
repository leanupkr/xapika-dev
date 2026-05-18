"use client";

import { usePathname } from "next/navigation";
import FooterCta from "./FooterCta";

type FooterCtaGateProps = {
  tagline: string;
  cta: string;
};

// Paths where the global FooterCta is suppressed because the page itself
// already renders a page-level CtaSection (avoids duplicate CTA stacking).
// Match patterns are tested in order; first match wins.
const HIDDEN_PATTERNS: ReadonlyArray<RegExp> = [
  /^\/solutions\/[^/]+$/,
  /^\/portfolios\/[^/]+$/,
  /^\/about\/[^/]+$/,
];

function isHidden(pathname: string): boolean {
  return HIDDEN_PATTERNS.some((pattern) => pattern.test(pathname));
}

export default function FooterCtaGate({ tagline, cta }: FooterCtaGateProps) {
  const pathname = usePathname();
  if (isHidden(pathname)) return null;
  return <FooterCta tagline={tagline} cta={cta} />;
}
