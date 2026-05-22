import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import JsonLd, { breadcrumbLd } from "@/components/seo/JsonLd";
import AboutHeader from "@/components/sections/AboutHeader";
import OurClients from "@/components/sections/OurClients";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: "/about/clients",
    title: "Our Clients",
    description:
      "National rail operators from Seoul to Cairo that trust Xapika with their fleets and stations.",
  });
}

export default async function ClientsPage() {
  return (
    <>
      <JsonLd
        id="ld-breadcrumb"
        data={breadcrumbLd({
          trail: [
            { name: "About Us", path: "about" },
            { name: "Our Clients", path: "about/clients" },
          ],
        })}
      />
      <AboutHeader
        overline="Our Clients"
        title="Trusted by national rail operators."
        subtitle="From Seoul to Cairo, Xapika serves the operators that move millions every day."
      />
      <OurClients
        overline="Our Clients"
        title="Trusted by national rail operators."
        subtitle="From Seoul to Cairo, Xapika serves the operators that move millions every day."
        logoArrivingNote="Logo arriving"
      />
    </>
  );
}
