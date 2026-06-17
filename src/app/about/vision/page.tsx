import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestOrigin } from "@/lib/seo-host";
import JsonLd, { breadcrumbLd } from "@/components/seo/JsonLd";
import AboutHeader from "@/components/sections/AboutHeader";
import Vision, { type VisionItem } from "@/components/sections/Vision";

export async function generateMetadata(): Promise<Metadata> {
  const origin = await getRequestOrigin();
  return buildPageMetadata({
    origin,
    path: "/about/vision",
    title: "Vision & Principles",
    description:
      "Perfect work, safe operations, precise engineering — the three commitments that define every Xapika contract.",
  });
}

const VISION_ITEMS: ReadonlyArray<VisionItem> = [
  {
    index: "01",
    title: "Perfect Work.",
    body: "We don't ship \"good enough.\" Every maintenance task closes against a verifiable checklist — signed by the technician, audited by the regulator.",
  },
  {
    index: "02",
    title: "Safe Operations.",
    body: "A ten-year zero-incident record across six countries. Safety is not a campaign — it is the operating boundary inside which speed, cost, and uptime are negotiated.",
  },
  {
    index: "03",
    title: "Precise Engineering.",
    body: "Every part replaced is traced. Every work order is timestamped. Precision is what makes a fleet of 213 units feel like one.",
  },
];

export default async function VisionPage() {
  const origin = await getRequestOrigin();
  return (
    <>
      <JsonLd
        id="ld-breadcrumb"
        data={breadcrumbLd(origin, {
          trail: [
            { name: "About Us", path: "about" },
            { name: "Vision & Principles", path: "about/vision" },
          ],
        })}
      />
      <AboutHeader
        overline="Our Principles"
        title="Three commitments. Tested under fire."
        subtitle="These are not slogans on a slide deck. They are the conditions under which our crews deploy, the metrics our regulators audit, and the standards our customers paid for."
      />
      <Vision
        overline="Our Principles"
        title="Three commitments. Tested under fire."
        subtitle="These are not slogans on a slide deck. They are the conditions under which our crews deploy, the metrics our regulators audit, and the standards our customers paid for."
        items={VISION_ITEMS}
      />
    </>
  );
}
