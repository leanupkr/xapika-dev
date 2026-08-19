import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestOrigin } from "@/lib/seo-host";
import JsonLd, { breadcrumbLd } from "@/components/seo/JsonLd";
import PageHero from "@/components/ui/PageHero";
import SectionContainer from "@/components/ui/SectionContainer";
import { CONTACT_EMAIL } from "@/lib/constants";

export async function generateMetadata(): Promise<Metadata> {
  const origin = await getRequestOrigin();
  return buildPageMetadata({
    origin,
    path: "/privacy",
    title: "Privacy Policy",
    description:
      "Privacy policy for Xapika Engineering — how we handle personal data and operator inquiries.",
  });
}

export default async function PrivacyPage() {
  const origin = await getRequestOrigin();
  return (
    <>
      <JsonLd
        id="ld-breadcrumb"
        data={breadcrumbLd(origin, {
          trail: [{ name: "Privacy Policy", path: "privacy" }],
        })}
      />
      <PageHero
        patternId="privacy-hero"
        overline="Privacy"
        title="Privacy Policy"
        subtitle="How Xapika Engineering handles personal data submitted through this site and operator inquiries."
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
        <SectionContainer>
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
              Full privacy policy is being prepared.
            </h2>
            <p
              className="font-body mb-3"
              style={{
                fontSize: "clamp(0.9375rem, 1.1vw, 1.0625rem)",
                color: "rgba(11,31,58,0.7)",
                lineHeight: 1.7,
              }}
            >
              We are finalising our privacy policy in line with EU GDPR and Polish data-protection law. The complete text — covering data collection, storage, processing, and your rights — will be published here once review is complete.
            </p>
            <p
              className="font-body"
              style={{
                fontSize: "clamp(0.9375rem, 1.1vw, 1.0625rem)",
                color: "rgba(11,31,58,0.55)",
                lineHeight: 1.7,
              }}
            >
              For inquiries about how we handle your data in the meantime, please contact{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-[rgb(var(--color-primary))] underline underline-offset-4 hover:opacity-80 transition-opacity"
              >
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </div>
        </SectionContainer>
      </section>
    </>
  );
}
