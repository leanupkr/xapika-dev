import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestOrigin } from "@/lib/seo-host";
import JsonLd, { breadcrumbLd } from "@/components/seo/JsonLd";
import AboutHeader from "@/components/sections/AboutHeader";
import OurClients from "@/components/sections/OurClients";

export async function generateMetadata(): Promise<Metadata> {
  const origin = await getRequestOrigin();
  return buildPageMetadata({
    origin,
    path: "/about/clients",
    title: "Our Clients",
    description:
      "National rail operators from Seoul to Warsaw that trust Xapika with their fleets and stations.",
  });
}

export default async function ClientsPage() {
  const origin = await getRequestOrigin();
  return (
    <>
      <JsonLd
        id="ld-breadcrumb"
        data={breadcrumbLd(origin, {
          trail: [
            { name: "About Us", path: "about" },
            { name: "Our Clients", path: "about/clients" },
          ],
        })}
      />
      <AboutHeader
        overline="Our Clients"
        title="Trusted by national rail operators."
        subtitle="From Seoul to Warsaw, Xapika serves the operators that move millions every day."
      />
      <OurClients
        overline="Our Clients"
        title="Trusted by national rail operators."
        subtitle="From Seoul to Warsaw, Xapika serves the operators that move millions every day."
        logoArrivingNote="Logo arriving"
      />
    </>
  );
}
