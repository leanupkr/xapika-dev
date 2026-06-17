import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestOrigin } from "@/lib/seo-host";
import JsonLd, { breadcrumbLd } from "@/components/seo/JsonLd";
import AboutHeader from "@/components/sections/AboutHeader";
import ContactInfo from "@/components/sections/ContactInfo";
import ContactInteractive from "@/components/contact/ContactInteractive";
import { HQ_ADDRESS } from "@/lib/constants";

export async function generateMetadata(): Promise<Metadata> {
  const origin = await getRequestOrigin();
  return buildPageMetadata({
    origin,
    path: "/contact",
    title: "Contact",
    description:
      "Tell us about your fleet. We respond within two business days — directly to the operating team, not a sales line.",
  });
}

export default async function ContactPage() {
  const origin = await getRequestOrigin();
  return (
    <>
      <JsonLd
        id="ld-breadcrumb"
        data={breadcrumbLd(origin, {
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
            hqValue={HQ_ADDRESS}
            hoursLabel="Business hours"
            officeLink="View 7 offices"
            openInMaps="Open in Google Maps"
          />
        }
      />
    </>
  );
}
