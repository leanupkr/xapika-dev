import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestOrigin } from "@/lib/seo-host";
import JsonLd, { breadcrumbLd } from "@/components/seo/JsonLd";
import AboutHeader from "@/components/sections/AboutHeader";
import OrgChart from "@/components/sections/OrgChart";

export async function generateMetadata(): Promise<Metadata> {
  const origin = await getRequestOrigin();
  return buildPageMetadata({
    origin,
    path: "/about/organization",
    title: "Organization",
    description:
      "Cross-functional teams across five countries — how Xapika Engineering is structured to operate as one unit.",
  });
}

export default async function OrganizationPage() {
  const origin = await getRequestOrigin();
  return (
    <>
      <JsonLd
        id="ld-breadcrumb"
        data={breadcrumbLd(origin, {
          trail: [
            { name: "About Us", path: "about" },
            { name: "Organization", path: "about/organization" },
          ],
        })}
      />
      <AboutHeader
        overline="Organization"
        title="Cross-functional teams across five countries."
        subtitle="From Warsaw to Seoul and Virginia — international offices aligned on one operational standard."
      />
      <OrgChart
        ceoLabel="Chief Executive Officer"
        ceoName="Zekeriya Polat"
        departments={[
          {
            key: "international",
            label: "International Operations Team",
            children: [
              "South Korea Office",
              "Uzbekistan Office",
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
