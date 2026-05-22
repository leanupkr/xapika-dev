import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import JsonLd, { breadcrumbLd } from "@/components/seo/JsonLd";
import PageHero from "@/components/ui/PageHero";

export function generateMetadata(): Metadata {
  return buildPageMetadata({
    path: "/terms",
    title: "Terms of Use",
    description:
      "Terms of use for the Xapika Engineering website and inquiry channels.",
  });
}

export default function TermsPage() {
  return (
    <>
      <JsonLd
        id="ld-breadcrumb"
        data={breadcrumbLd({
          trail: [{ name: "Terms of Use", path: "terms" }],
        })}
      />
      <PageHero
        patternId="terms-hero"
        overline="Terms"
        title="Terms of Use"
        subtitle="Conditions of access and use of the Xapika Engineering website and inquiry channels."
      />
      <section
        data-bg="light"
        className="relative"
        style={{
          backgroundColor: "rgb(var(--color-bg))",
          paddingTop: "clamp(4rem, 8vh, 6rem)",
          paddingBottom: "clamp(5rem, 10vh, 7.5rem)",
        }}
      >
        <div
          className="mx-auto px-6 md:px-10 lg:px-16"
          style={{ maxWidth: "var(--max-width-content)" }}
        >
          <div className="max-w-2xl">
            <p
              className="font-heading uppercase mb-4 text-[rgb(var(--color-primary))]"
              style={{ fontSize: "12px", letterSpacing: "0.22em" }}
            >
              Document Preparation
            </p>
            <h2
              className="font-heading font-semibold mb-5"
              style={{
                fontSize: "clamp(1.5rem, 2.4vw, 1.875rem)",
                color: "rgb(var(--color-ink))",
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
              }}
            >
              Full terms of use are being prepared.
            </h2>
            <p
              className="font-body mb-3"
              style={{
                fontSize: "clamp(0.9375rem, 1.1vw, 1.0625rem)",
                color: "rgba(11,31,58,0.7)",
                lineHeight: 1.7,
              }}
            >
              We are finalising our terms of use, including provisions on intellectual property, acceptable use, and the limited warranty applicable to information published on this site. The complete text will be published here once review is complete.
            </p>
            <p
              className="font-body"
              style={{
                fontSize: "clamp(0.9375rem, 1.1vw, 1.0625rem)",
                color: "rgba(11,31,58,0.55)",
                lineHeight: 1.7,
              }}
            >
              For inquiries about the use of this site or our content in the meantime, please contact{" "}
              <a
                href="mailto:info@xapika.pl"
                className="text-[rgb(var(--color-primary))] underline underline-offset-4 hover:opacity-80 transition-opacity"
              >
                info@xapika.pl
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
