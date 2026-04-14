import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Mail, MapPin } from "lucide-react";

const FOOTER_LINKS = [
  { key: "about", href: "/about" },
  { key: "solutions", href: "/solutions" },
  { key: "portfolios", href: "/portfolios" },
  { key: "contact", href: "/contact" },
] as const;

const OFFICES = [
  {
    key: "polandHq",
    city: "Kraków, Poland",
    detail: "Headquarters",
  },
  {
    key: "seoulOffice",
    city: "Seoul, Korea",
    detail: "Asia Pacific",
  },
  {
    key: "warsawOffice",
    city: "Warsaw, Poland",
    detail: "Operations",
  },
] as const;

export default async function Footer() {
  const tFooter = await getTranslations("footer");
  const tNav = await getTranslations("nav");

  return (
    <footer
      className="bg-ink text-white"
      style={{ paddingTop: "var(--space-section)", paddingBottom: "3rem" }}
    >
      <div
        className="mx-auto px-6"
        style={{ maxWidth: "var(--max-width)" }}
      >
        {/* CTA strip */}
        <div className="mb-16 pb-16 border-b border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <p
            className="font-heading font-semibold text-white"
            style={{ fontSize: "clamp(1.375rem, 2.5vw, 1.875rem)" }}
          >
            {tFooter("tagline")}
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-3 rounded bg-primary text-white font-heading font-medium tracking-[0.04em] uppercase transition-colors duration-200 hover:bg-primary-hover flex-shrink-0"
            style={{ fontSize: "13px" }}
          >
            {tFooter("cta")}
          </Link>
        </div>

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
              className="text-white/50 leading-relaxed"
              style={{ fontSize: "0.875rem" }}
            >
              Precision rail maintenance with uncompromised safety.
            </p>
          </div>

          {/* Navigation column */}
          <div>
            <h3
              className="font-heading font-semibold tracking-widest uppercase text-white/40 mb-5"
              style={{ fontSize: "0.6875rem" }}
            >
              Navigation
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
              Global Offices
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {OFFICES.map(({ key, city, detail }) => (
                <div key={key} className="flex gap-3">
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
                      {tFooter(key)}
                    </p>
                    <p
                      className="text-white/40"
                      style={{ fontSize: "0.75rem" }}
                    >
                      {city}
                    </p>
                    <p
                      className="text-white/30"
                      style={{ fontSize: "0.75rem" }}
                    >
                      {detail}
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
          <p className="text-white/20" style={{ fontSize: "0.75rem" }}>
            Engineering excellence in rail maintenance
          </p>
        </div>
      </div>
    </footer>
  );
}
