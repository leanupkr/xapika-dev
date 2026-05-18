import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import JsonLd, { breadcrumbLd } from "@/components/seo/JsonLd";
import PageHero from "@/components/ui/PageHero";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "termsPage.meta" });
  return buildPageMetadata({
    locale,
    path: "/terms",
    title: t("title"),
    description: t("description"),
  });
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tPage = await getTranslations("termsPage");

  return (
    <>
      <JsonLd
        id="ld-breadcrumb"
        data={breadcrumbLd({
          locale,
          trail: [{ name: tPage("breadcrumb"), path: "terms" }],
        })}
      />
      <PageHero
        patternId="terms-hero"
        overline={tPage("overline")}
        title={tPage("title")}
        subtitle={tPage("subtitle")}
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
              {tPage("placeholderOverline")}
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
              {tPage("placeholderTitle")}
            </h2>
            <p
              className="font-body mb-3"
              style={{
                fontSize: "clamp(0.9375rem, 1.1vw, 1.0625rem)",
                color: "rgba(11,31,58,0.7)",
                lineHeight: 1.7,
              }}
            >
              {tPage("placeholderBody")}
            </p>
            <p
              className="font-body"
              style={{
                fontSize: "clamp(0.9375rem, 1.1vw, 1.0625rem)",
                color: "rgba(11,31,58,0.55)",
                lineHeight: 1.7,
              }}
            >
              {tPage("contactPrefix")}{" "}
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
