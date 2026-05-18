import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Mail, MapPin } from "lucide-react";
import FooterCtaGate from "./FooterCtaGate";

const FOOTER_LINKS = [
  { key: "about", href: "/about" },
  { key: "solutions", href: "/solutions" },
  { key: "portfolios", href: "/portfolios" },
  { key: "locations", href: "/locations" },
  { key: "contact", href: "/contact" },
] as const;

const OFFICES = [
  { nameKey: "warsawHq",     country: "Poland",     detailKey: "warsawHqDetail" },
  { nameKey: "warsawOffice", country: "Poland",     detailKey: "warsawOfficeDetail" },
  { nameKey: "kyiv",         country: "Ukraine",    detailKey: "kyivDetail" },
  { nameKey: "seoul",        country: "Korea",      detailKey: "seoulDetail" },
  { nameKey: "tashkent",     country: "Uzbekistan", detailKey: "tashkentDetail" },
  { nameKey: "cairo",        country: "Egypt",      detailKey: "cairoDetail" },
  { nameKey: "virginia",     country: "USA",        detailKey: "virginiaDetail" },
  { nameKey: "saoPaulo",     country: "Brazil",     detailKey: "saoPauloDetail" },
  { nameKey: "istanbul",     country: "Türkiye",    detailKey: "istanbulDetail" },
] as const;

export default async function Footer() {
  const tFooter = await getTranslations("footer");
  const tNav = await getTranslations("nav");

  return (
    <footer
      className="bg-ink text-white"
      style={{ paddingTop: "2rem", paddingBottom: "3rem" }}
    >
      <div
        className="mx-auto px-6"
        style={{ maxWidth: "var(--max-width)" }}
      >
        {/* CTA strip */}
        <FooterCtaGate tagline={tFooter("tagline")} cta={tFooter("cta")} />

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand column */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/logo-white.png"
                alt="Xapika Engineering"
                width={120}
                height={32}
                className="object-contain"
                style={{ height: "32px", width: "auto" }}
              />
            </Link>
            <p
              className="font-heading font-semibold text-[rgb(var(--color-primary))] mb-3"
              style={{ fontSize: "0.875rem", letterSpacing: "0.02em" }}
            >
              {tFooter("slogan")}
            </p>
            <p
              className="text-white/50 leading-relaxed"
              style={{ fontSize: "0.875rem" }}
            >
              {tFooter("brandTagline")}
            </p>
          </div>

          {/* Navigation column */}
          <div>
            <h3
              className="font-heading font-semibold tracking-widest uppercase text-white/40 mb-5"
              style={{ fontSize: "0.6875rem" }}
            >
              {tFooter("navHeading")}
            </h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.map(({ key, href }) => (
                <li key={key}>
                  <Link
                    href={href}
                    className="text-white/60 hover:text-white transition-colors duration-200 font-heading font-medium"
                    style={{ fontSize: "0.875rem" }}
                  >
                    {tNav(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Offices column */}
          <div className="md:col-span-2">
            <h3
              className="font-heading font-semibold tracking-widest uppercase text-white/40 mb-5"
              style={{ fontSize: "0.6875rem" }}
            >
              {tFooter("officesHeading")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
              {OFFICES.map(({ nameKey, country, detailKey }) => (
                <div key={nameKey} className="flex gap-3">
                  <MapPin
                    size={14}
                    className="text-primary mt-0.5 flex-shrink-0"
                    strokeWidth={2}
                  />
                  <div>
                    <p
                      className="text-white/80 font-medium"
                      style={{ fontSize: "0.8125rem" }}
                    >
                      {tFooter(nameKey)}
                    </p>
                    <p
                      className="text-white/40"
                      style={{ fontSize: "0.75rem" }}
                    >
                      {country}
                    </p>
                    <p
                      className="text-white/30"
                      style={{ fontSize: "0.75rem" }}
                    >
                      {tFooter(detailKey)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Email */}
            <a
              href="mailto:info@xapika.pl"
              className="inline-flex items-center gap-2 mt-8 text-white/60 hover:text-white transition-colors duration-200"
              style={{ fontSize: "0.875rem" }}
            >
              <Mail size={14} strokeWidth={2} className="text-primary" />
              info@xapika.pl
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30" style={{ fontSize: "0.8125rem" }}>
            {tFooter("copyright")}
          </p>
          <div
            className="flex items-center gap-5"
            style={{ fontSize: "0.75rem" }}
          >
            <Link
              href="/privacy"
              className="text-white/40 hover:text-white/70 transition-colors duration-200"
            >
              {tFooter("privacyLink")}
            </Link>
            <span aria-hidden="true" className="text-white/20">
              ·
            </span>
            <Link
              href="/terms"
              className="text-white/40 hover:text-white/70 transition-colors duration-200"
            >
              {tFooter("termsLink")}
            </Link>
          </div>
          <p className="text-white/20" style={{ fontSize: "0.75rem" }}>
            {tFooter("rightTagline")}
          </p>
        </div>
      </div>
    </footer>
  );
}
