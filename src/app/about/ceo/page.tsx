import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import JsonLd, { breadcrumbLd } from "@/components/seo/JsonLd";
import AboutHeader from "@/components/sections/AboutHeader";
import CeoMessage from "@/components/sections/CeoMessage";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: "/about/ceo",
    title: "CEO Message",
    description:
      "A founder note on continuous rail operations across five countries.",
  });
}

export default async function CeoPage() {
  return (
    <>
      <JsonLd
        id="ld-breadcrumb"
        data={breadcrumbLd({
          trail: [
            { name: "About Us", path: "about" },
            { name: "CEO Message", path: "about/ceo" },
          ],
        })}
      />
      <AboutHeader
        overline="Leadership"
        title="A message from our CEO."
        subtitle="A note from the founder on what reliable railway maintenance means in practice."
      />
      <CeoMessage
        overline="Leadership"
        title="A message from our CEO."
        subtitle="A note from the founder on what reliable railway maintenance means in practice."
        bodyParagraphs={[
          "At Xapika Engineering, we believe that reliable railway maintenance is the foundation of safe, efficient, and sustainable transportation.",
          "Since our establishment, we have focused on delivering professional maintenance, technical support, and engineering solutions for railway rolling stock systems. With our operational base in Poland and cooperation across international railway markets, we continuously strive to provide practical and high-quality services tailored to the needs of operators and manufacturers.",
          "Our team combines field experience, technical expertise, and a strong commitment to safety and quality. We understand that railway systems require not only technical precision, but also responsiveness, accountability, and long-term partnership.",
          "As the railway industry continues to evolve through digitalization, sustainability, and advanced maintenance technologies, Xapika Engineering remains committed to supporting our partners with innovative and dependable solutions.",
          "We sincerely appreciate the trust and support of our clients and partners, and we look forward to building a safer and more efficient railway future together.",
        ]}
        name="Zekeriya Polat"
        position="CEO, Xapika Engineering"
        signatureAlt="Zekeriya Polat signature"
        closingLine="Sincerely,"
      />
    </>
  );
}
