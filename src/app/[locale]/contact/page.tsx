import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import AboutHeader from "@/components/sections/AboutHeader";
import ContactInfo from "@/components/sections/ContactInfo";
import ContactForm from "@/components/sections/ContactForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const tMeta = await getTranslations({
    locale,
    namespace: "contactPage.meta",
  });
  return {
    title: "Contact — Xapika Engineering",
    description: tMeta("description"),
  };
}

export default async function ContactPage() {
  const tHeader = await getTranslations("contactPage.header");
  const tInfo = await getTranslations("contactPage.info");

  return (
    <>
      <AboutHeader
        overline={tHeader("overline")}
        title={tHeader("title")}
        subtitle={tHeader("subtitle")}
      />
      <section
        data-bg="light"
        className="relative"
        style={{
          backgroundColor: "rgb(var(--color-bg))",
          paddingTop: "clamp(4rem, 8vh, 6rem)",
          paddingBottom: "clamp(5rem, 10vh, 7.5rem)",
        }}
      >
        <div
          className="relative mx-auto px-6 md:px-10 lg:px-16"
          style={{ maxWidth: "var(--max-width)" }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-5 lg:sticky lg:top-28">
              <ContactInfo
                overline={tInfo("overline")}
                emailLabel={tInfo("email")}
                emailValue={tInfo("emailValue")}
                hqLabel={tInfo("hq")}
                hqValue={tInfo("hqValue")}
                hoursLabel={tInfo("hours")}
                hoursValue={tInfo("hoursValue")}
                officeLink={tInfo("officeLink")}
              />
            </div>
            <div className="lg:col-span-7">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
