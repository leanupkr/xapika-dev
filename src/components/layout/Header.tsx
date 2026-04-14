"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import MobileMenu from "./MobileMenu";

const NAV_LINKS = [
  { key: "about", href: "/about" },
  { key: "solutions", href: "/solutions" },
  { key: "portfolios", href: "/portfolios" },
  { key: "locations", href: "/locations" },
  { key: "contact", href: "/contact" },
] as const;

export default function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 16);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function switchLocale(nextLocale: string) {
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <>
      <header
        className={[
          "fixed top-0 left-0 right-0 z-30 transition-all duration-300",
          scrolled
            ? "bg-surface/80 backdrop-blur-lg border-b shadow-sm"
            : "bg-transparent border-b border-transparent",
        ].join(" ")}
        style={{
          height: scrolled ? "64px" : "80px",
          borderBottomColor: scrolled ? "rgb(var(--color-ink) / 0.1)" : "transparent",
          transitionTimingFunction: "var(--ease-out)",
        }}
      >
        <div
          className="mx-auto flex h-full items-center justify-between px-6"
          style={{ maxWidth: "var(--max-width)" }}
        >
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src={scrolled ? "/logo.png" : "/logo-white.png"}
              alt="Xapika Engineering"
              width={120}
              height={32}
              className="object-contain transition-opacity duration-300"
              style={{ height: "32px", width: "auto" }}
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ key, href }) => (
              <Link
                key={key}
                href={href}
                className={[
                  "font-heading font-medium tracking-[0.05em] uppercase transition-colors duration-200",
                  scrolled
                    ? "text-ink hover:text-primary"
                    : "text-white/90 hover:text-white",
                ].join(" ")}
                style={{ fontSize: "13px" }}
              >
                {t(key)}
              </Link>
            ))}
          </nav>

          {/* Locale switcher (desktop) + hamburger (mobile) */}
          <div className="flex items-center gap-4">
            {/* Language toggle */}
            <div className="hidden md:flex items-center gap-1">
              {(["en", "ko"] as const).map((lng, idx) => (
                <span key={lng} className="flex items-center">
                  {idx > 0 && (
                    <span
                      className={[
                        "mx-1",
                        scrolled ? "text-ink-muted" : "text-white/40",
                      ].join(" ")}
                    >
                      |
                    </span>
                  )}
                  <button
                    onClick={() => switchLocale(lng)}
                    className={[
                      "font-heading font-medium tracking-[0.05em] uppercase transition-colors duration-200",
                      locale === lng
                        ? scrolled
                          ? "text-primary"
                          : "text-white font-semibold"
                        : scrolled
                        ? "text-ink-muted hover:text-ink"
                        : "text-white/50 hover:text-white/80",
                    ].join(" ")}
                    style={{ fontSize: "13px" }}
                  >
                    {lng.toUpperCase()}
                  </button>
                </span>
              ))}
            </div>

            {/* Hamburger */}
            <button
              className={[
                "md:hidden p-2 -mr-2 transition-colors duration-200",
                scrolled
                  ? "text-ink hover:text-primary"
                  : "text-white hover:text-white/70",
              ].join(" ")}
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={24} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
