import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import JsonLd, { breadcrumbLd } from "@/components/seo/JsonLd";
import AboutHeader from "@/components/sections/AboutHeader";
import ContactInfo from "@/components/sections/ContactInfo";
import ContactInteractive from "@/components/contact/ContactInteractive";

export function generateMetadata(): Metadata {
  return buildPageMetadata({
    path: "/contact",
    title: "Contact",
    description:
      "Tell us about your fleet. We respond within two business days — directly to the operating team, not a sales line.",
  });
}

export default function ContactPage() {
  return (
    <>
      <JsonLd
        id="ld-breadcrumb"
        data={breadcrumbLd({
          trail: [{ name: "Contact Us", path: "contact" }],
        })}
      />
      <AboutHeader
        overline="Contact"
        title="Let's talk operations."
        subtitle="We're a 2-business-day response company. Faster lines below."
      />
      <ContactInteractive
        contactInfoSlot={
          <ContactInfo
            overline="Get in touch"
            hqLabel="Headquarters"
            hqValue="Kolejowa 234, 05-092 Dziekanów Leśny, Poland"
            hoursLabel="Business hours"
            officeLink="View 9 offices"
            openInMaps="Open in Google Maps"
          />
        }
      />
    </>
  );
}
