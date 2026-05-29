import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import Hero from "@/components/sections/Hero";
import KeyNumbers from "@/components/sections/KeyNumbers";
import SolutionsGrid, { type SolutionMetric } from "@/components/sections/SolutionsGrid";
import PortfoliosPreview from "@/components/sections/PortfoliosPreview";
import TrustedBy from "@/components/sections/TrustedBy";
import GlobalPresence from "@/components/sections/GlobalPresence";

export function generateMetadata(): Metadata {
  return buildPageMetadata({
    path: "",
    title: "Xapika Engineering",
    description: "Delivering precision maintenance with uncompromising safety.",
  });
}

export default function HomePage() {
  const headline = "Perfect Work. Safe Operations.";
  const headlineAccent = headline.includes("Safe Operations.")
    ? "Safe Operations."
    : "";

  return (
    <>
      <Hero
        headline={headline}
        headlineAccent={headlineAccent}
        subheadline="Delivering precision maintenance with uncompromising safety."
        overline="Rail Maintenance Excellence"
        ctaSolutions="Explore Solutions"
        ctaContact="Contact Us"
        ctaSolutionsHref="/solutions"
        ctaContactHref="/contact"
        pauseAriaLabel="Pause slideshow"
        playAriaLabel="Play slideshow"
      />
      <KeyNumbers
        overline="By the Numbers"
        title="Measured in fleet, miles, and uptime."
        subtitle="Operational scale across five countries, verified by customers and regulators."
        stats={[
          {
            value: "227",
            label: "Total Maintenance Fleet",
            note: "Trains actively maintained",
          },
          {
            value: "22,000+",
            label: "Maintenance Cases / Year",
            note: "Verified service actions",
          },
          {
            value: "5",
            unit: "countries",
            label: "Countries of Operations",
            note: "Active depots and crews",
          },
          {
            value: "110+",
            label: "Total Workforce",
            note: "Engineers, technicians, operators",
          },
        ]}
      />
      <SolutionsGrid
        overline="Solutions"
        title="Five disciplines. One standard of safety."
        subtitle="Every service is measured, audited, and aligned with regulator requirements across all operating countries."
        items={{
          light: {
            title: "Light Maintenance",
            description:
              "Routine inspection, preventive maintenance, troubleshooting, and rapid-response support services designed to maximize fleet availability and ensure safe daily railway operations.",
            metrics: [
              { value: "5,900+", label: "Activities Annually" },
            ] as ReadonlyArray<SolutionMetric>,
          },
          heavy: {
            title: "Heavy Maintenance",
            description:
              "Comprehensive overhaul, refurbishment, and lifecycle extension services for rolling stock systems, ensuring long-term reliability, safety, and operational performance.",
            metrics: [
              { value: "320+", label: "Activities Annually" },
            ] as ReadonlyArray<SolutionMetric>,
          },
          supply: {
            title: "Rolling Stock SCM",
            description:
              "Integrated sourcing, spare parts supply, logistics coordination, and inventory support solutions tailored for railway maintenance and operational continuity.",
            metrics: [
              { value: "50+", label: "Global Partners" },
              { value: "8,000+", label: "Parts Managed" },
            ] as ReadonlyArray<SolutionMetric>,
          },
          digital: {
            title: "Digital Solutions & Asset Management",
            description:
              "Data-driven maintenance and asset lifecycle management solutions powered by VISION IT technologies, including MMIS, work order management, inventory tracking, and operational analytics for modern railway systems.",
            metrics: [
              { value: "30%", label: "Faster Response" },
              { value: "97%", label: "Inventory Accuracy" },
            ] as ReadonlyArray<SolutionMetric>,
          },
          commercial: {
            title: "Integrated Commercial & Ancillary Services",
            description:
              "Commercial development and business support solutions for railway environments, including retail operations, advertising, logistics coordination, and non-fare revenue services for railway operators and transit networks.",
            metrics: [] as ReadonlyArray<SolutionMetric>,
          },
        }}
      />
      <PortfoliosPreview
        overline="Portfolios"
        title="Nine years of unbroken service."
        subtitle="Project commitments that survived war, weather, and regulator change — delivered under continuous audit."
        viewAll="View all portfolios"
        items={{
          ukraine: {
            number: "CASE 01",
            country: "Ukraine",
            project: "HRCS2 Fleet — Ukrzaliznytsia",
            since: "Since 2017",
            badge: "Uninterrupted Since War",
            m1_value: "90",
            m1_label: "HRCS2 cars",
            m2_value: "82,000+",
            m2_label: "Maintenance actions",
            m3_value: "9 yrs",
            m3_label: "Continuous service",
            cta: "Read case study",
          },
          poland: {
            number: "CASE 02",
            country: "Poland",
            project: "Tramwaje Warszawskie",
            since: "Since 2021",
            m1_value: "123",
            m1_label: "Tram units",
            m2_value: "Warsaw",
            m2_label: "Depot city",
            cta: "Program details",
          },
          uzbekistan: {
            number: "CASE 03",
            country: "Uzbekistan",
            project: "High-Speed Rail Maintenance Hub",
            since: "Coming May 2026",
            badge: "In preparation",
            m1_value: "HSR",
            m1_label: "Service class",
            m2_value: "Tashkent",
            m2_label: "Depot city",
            cta: "Partnership notice",
          },
        }}
      />
      <TrustedBy overline="Strategic partners enabling global operations" />
      <GlobalPresence
        overline="Global Network"
        title="Six countries. One standard."
        subtitle="Active depots and engineering crews across Europe, Asia, and North America."
        stat1Value="3"
        stat1Unit="Warehouses"
        stat2Value="5"
        stat2Unit="Engineering Locations"
        stat3Value="7"
        stat3Unit="Offices"
      />
    </>
  );
}
