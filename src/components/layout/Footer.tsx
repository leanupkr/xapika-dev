import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Mail, MapPin } from "lucide-react";

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
        <div
          className="relative mb-16 overflow-hidden rounded-2xl border border-white/[0.06]"
          style={{ minHeight: "320px" }}
        >
          {/* 미묘한 레일 패턴 배경 */}
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.04]"
            aria-hidden="true"
          >
            <defs>
              <pattern id="rail-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <line x1="20" y1="0" x2="20" y2="60" stroke="white" strokeWidth="1" />
                <line x1="40" y1="0" x2="40" y2="60" stroke="white" strokeWidth="1" />
                <line x1="0" y1="15" x2="60" y2="15" stroke="white" strokeWidth="0.5" />
                <line x1="0" y1="30" x2="60" y2="30" stroke="white" strokeWidth="0.5" />
                <line x1="0" y1="45" x2="60" y2="45" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#rail-grid)" />
          </svg>
          {/* 상단 hairline */}
          <div className="absolute top-0 left-0 right-0 h-px bg-white/[0.08]" />
          {/* 콘텐츠 */}
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8 px-10 py-16 md:py-0 h-full" style={{ minHeight: "320px" }}>
            <div className="max-w-lg">
              <span
                className="flex items-center gap-3 font-heading font-medium uppercase mb-4"
                style={{ fontSize: "12px", letterSpacing: "0.15em", color: "rgb(var(--color-primary))" }}
              >
                <span className="inline-block w-5 h-0.5" style={{ backgroundColor: "rgb(var(--color-primary))" }} />
                Get in Touch
              </span>
              <p
                className="font-heading font-semibold text-white"
                style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", lineHeight: 1.2 }}
              >
                {tFooter("tagline")}
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg font-heading font-semibold text-white transition-all duration-200 flex-shrink-0"
              style={{
                fontSize: "15px",
                padding: "16px 32px",
                backgroundColor: "rgb(var(--color-primary))",
                boxShadow: "inset 0 -1px 0 rgba(0,0,0,0.1), 0 4px 16px rgba(246,163,23,0.3)",
              }}
            >
              {tFooter("cta")}
              <ArrowRight size={16} strokeWidth={2} />
            </Link>
          </div>
          {/* 하단 hairline */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-white/[0.08]" />
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
