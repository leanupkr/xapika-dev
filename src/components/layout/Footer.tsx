import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import FooterCtaGate from "./FooterCtaGate";

const FOOTER_LINKS = [
  { key: "about",      href: "/about",      label: "About Us" },
  { key: "solutions",  href: "/solutions",  label: "Solutions" },
  { key: "portfolios", href: "/portfolios", label: "Portfolios" },
  { key: "locations",  href: "/locations",  label: "Locations" },
] as const;

const OFFICES = [
  { nameKey: "warsawHq",     name: "Warsaw HQ",  country: "Poland",     detail: "Headquarters" },
  { nameKey: "warsawOffice", name: "Warsaw",      country: "Poland",     detail: "Tram & Metro Office" },
  { nameKey: "kyiv",         name: "Kyiv",        country: "Ukraine",    detail: "EMU Crew" },
  { nameKey: "seoul",        name: "Seoul",       country: "Korea",      detail: "Asia Pacific" },
  { nameKey: "tashkent",     name: "Tashkent",    country: "Uzbekistan", detail: "Central Asia" },
  { nameKey: "cairo",        name: "Cairo",       country: "Egypt",      detail: "MENA" },
  { nameKey: "virginia",     name: "Virginia",    country: "USA",        detail: "North America" },
  { nameKey: "saoPaulo",     name: "São Paulo",   country: "Brazil",     detail: "Latin America" },
  { nameKey: "istanbul",     name: "Istanbul",    country: "Türkiye",    detail: "Founding Office" },
] as const;

export default function Footer() {
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
        <FooterCtaGate
          tagline="Ready to build the future of rail with us?"
          cta="Contact Us"
        />

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
              Engineered for Perfection. Committed to Safety.
            </p>
            <p
              className="text-white/50 leading-relaxed"
              style={{ fontSize: "0.875rem" }}
            >
              Precision rail maintenance with uncompromising safety.
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
              {FOOTER_LINKS.map(({ key, href, label }) => (
                <li key={key}>
                  <Link
                    href={href}
                    className="text-white/60 hover:text-white transition-colors duration-200 font-heading font-medium"
                    style={{ fontSize: "0.875rem" }}
                  >
                    {label}
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
            {/* grid-cols-1 on mobile (<640px) prevents city names from
                wrapping in narrow 2-col layout; sm: restores 2 cols */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-4">
              {OFFICES.map(({ nameKey, name, country, detail }) => (
                <div key={nameKey} className="flex gap-2">
                  <MapPin
                    size={14}
                    className="text-primary mt-0.5 flex-shrink-0 hidden sm:inline-block"
                    strokeWidth={2}
                  />
                  <div>
                    <p
                      className="text-white/80 font-medium"
                      style={{ fontSize: "0.8125rem" }}
                    >
                      {name}
                    </p>
                    <p
                      className="text-white/40"
                      style={{ fontSize: "0.75rem" }}
                    >
                      {country}
                    </p>
                    <p
                      className="text-white/30 hidden sm:block"
                      style={{ fontSize: "0.75rem" }}
                    >
                      {detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30" style={{ fontSize: "0.8125rem" }}>
            © 2026 Xapika Engineering. All rights reserved.
          </p>
          <div
            className="flex items-center gap-5"
            style={{ fontSize: "0.75rem" }}
          >
            <Link
              href="/privacy"
              className="text-white/40 hover:text-white/70 transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <span aria-hidden="true" className="text-white/20">
              ·
            </span>
            <Link
              href="/terms"
              className="text-white/40 hover:text-white/70 transition-colors duration-200"
            >
              Terms of Use
            </Link>
          </div>
          <p className="hidden sm:block text-white/20" style={{ fontSize: "0.75rem" }}>
            Engineering excellence in rail maintenance
          </p>
        </div>
      </div>
    </footer>
  );
}
