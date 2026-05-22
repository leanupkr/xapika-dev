import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import JsonLd, { breadcrumbLd } from "@/components/seo/JsonLd";
import AboutHeader from "@/components/sections/AboutHeader";
import OrgChart from "@/components/sections/OrgChart";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: "/about/organization",
    title: "Organization",
    description:
      "Cross-functional teams across five countries — how Xapika Engineering is structured to operate as one unit.",
  });
}

export default async function OrganizationPage() {
  return (
    <>
      <JsonLd
        id="ld-breadcrumb"
        data={breadcrumbLd({
          trail: [
            { name: "About Us", path: "about" },
            { name: "Organization", path: "about/organization" },
          ],
        })}
      />
      <AboutHeader
        overline="Organization"
        title="Cross-functional teams across five countries."
        subtitle="From Warsaw to Seoul, Cairo, and São Paulo — six international offices, one operational standard."
      />
      <OrgChart
        ceoLabel="Chief Executive Officer"
        ceoName="Zekeriya Polat"
        departments={[
          {
            key: "international",
            label: "International Operations Team",
            children: [
              "Republic of Korea Office",
              "Uzbekistan Office",
              "Morocco Office",
              "Egypt Office",
              "São Paulo Office",
              "Türkiye Office",
            ],
          },
          {
            key: "maintenance",
            label: "Maintenance Department",
            leadLabel: "CTO",
            children: ["Light Maintenance", "Heavy Maintenance"],
          },
          {
            key: "supply",
            label: "Supply Chain Department",
            children: ["Procurement Department"],
          },
        ]}
        sharedLeaves={[
          {
            key: "overhaul",
            label: "Overhaul Team",
            parents: ["maintenance", "supply"],
          },
        ]}
        staff={{
          label: "Finance & HR Department",
          children: ["Accounting", "Finance", "Human Resources"],
        }}
      />
    </>
  );
}
