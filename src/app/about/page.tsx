import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import JsonLd, { aboutPageLd, breadcrumbLd } from "@/components/seo/JsonLd";
import AboutHeader from "@/components/sections/AboutHeader";
import AboutCardGrid from "@/components/sections/AboutCardGrid";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: "/about",
    title: "About Us",
    description:
      "A decade of precision rail maintenance across five countries — Xapika Engineering's history, principles, and operating standard.",
  });
}

export default async function AboutPage() {
  return (
    <>
      <JsonLd
        id="ld-about"
        data={aboutPageLd(
          "A decade of precision rail maintenance across five countries — Xapika Engineering's history, principles, and operating standard.",
        )}
      />
      <JsonLd
        id="ld-breadcrumb"
        data={breadcrumbLd({
          trail: [{ name: "About Us", path: "about" }],
        })}
      />
      <AboutHeader
        overline="Our Story"
        title="From Istanbul to Tashkent, one operating discipline."
        subtitle="Ten years of rail maintenance precision, delivered across five countries without a single contract default."
      />
      <AboutCardGrid
        overline="Explore Sections"
        title="Five threads of one operating standard."
        cards={{
          ceo: {
            title: "CEO Message",
            description:
              "A note from the founder on what continuous operation means in practice.",
          },
          history: {
            title: "Our History",
            description:
              "Ten years from Istanbul to Tashkent — one milestone at a time.",
          },
          vision: {
            title: "Vision & Principles",
            description:
              "Perfect work, safe operations, precise engineering — the three commitments behind every contract.",
          },
          organization: {
            title: "Organization",
            description:
              "Cross-functional teams across five countries, operating as one unit.",
          },
          clients: {
            title: "Our Clients",
            description:
              "National rail operators that trust Xapika with their fleets and stations.",
          },
        }}
      />
    </>
  );
}
