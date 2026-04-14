"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Menu, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import MobileMenu from "./MobileMenu";

const SOLUTIONS_ITEMS = [
  { key: "heavy_maintenance", href: "/solutions/heavy-maintenance" },
  { key: "light_maintenance", href: "/solutions/light-maintenance" },
  { key: "supply_chain", href: "/solutions/supply-chain" },
  { key: "digital_asset", href: "/solutions/digital-asset-management" },
  { key: "commercial", href: "/solutions/commercial-services" },
] as const;

const NAV_LINKS = [
  { key: "about", href: "/about", hasDropdown: false },
  { key: "solutions", href: "/solutions", hasDropdown: true },
  { key: "portfolios", href: "/portfolios", hasDropdown: false },
  { key: "locations", href: "/locations", hasDropdown: false },
  { key: "contact", href: "/contact", hasDropdown: false },
] as const;

export default function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const solutionsRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 16);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (solutionsRef.current && !solutionsRef.current.contains(e.target as Node)) {
        setSolutionsOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function switchLocale(nextLocale: string) {
    router.replace(pathname, { locale: nextLocale });
  }

  function handleSolutionsEnter() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setSolutionsOpen(true);
  }

  function handleSolutionsLeave() {
    closeTimer.current = setTimeout(() => setSolutionsOpen(false), 120);
  }

  return (
    <>
      <header
        className={[
          "fixed top-0 left-0 right-0 z-30 transition-all duration-300",
          scrolled
            ? "bg-white/90 backdrop-blur-xl border-b"
            : "bg-transparent border-b border-transparent",
        ].join(" ")}
        style={{
          height: scrolled ? "64px" : "80px",
          borderBottomColor: scrolled
            ? "rgb(var(--color-ink) / 0.08)"
            : "transparent",
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
            {NAV_LINKS.map(({ key, href, hasDropdown }) => {
              if (hasDropdown && key === "solutions") {
                return (
                  <div
                    key={key}
                    ref={solutionsRef}
                    className="relative"
                    onMouseEnter={handleSolutionsEnter}
                    onMouseLeave={handleSolutionsLeave}
                  >
                    <button
                      className={[
                        "flex items-center gap-1 font-heading font-medium tracking-[0.05em] uppercase transition-colors duration-200",
                        scrolled
                          ? "text-ink hover:text-primary"
                          : "text-white/90 hover:text-white",
                      ].join(" ")}
                      style={{ fontSize: "13px" }}
                      aria-expanded={solutionsOpen}
                      aria-haspopup="true"
                    >
                      {t(key)}
                      <ChevronDown
                        size={14}
                        strokeWidth={2}
                        className={[
                          "transition-transform duration-200",
                          solutionsOpen ? "rotate-180" : "",
                        ].join(" ")}
                      />
                    </button>

                    <AnimatePresence>
                      {solutionsOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="absolute top-full left-0 mt-3 w-56 bg-white shadow-lg rounded-lg border overflow-hidden"
                          style={{
                            borderColor: "rgb(var(--color-ink) / 0.08)",
                          }}
                          onMouseEnter={handleSolutionsEnter}
                          onMouseLeave={handleSolutionsLeave}
                        >
                          {SOLUTIONS_ITEMS.map(({ key: itemKey, href: itemHref }) => (
                            <Link
                              key={itemKey}
                              href={itemHref}
                              onClick={() => setSolutionsOpen(false)}
                              className="block px-4 py-3 text-ink hover:text-primary hover:bg-primary-subtle transition-colors duration-150 font-heading font-medium"
                              style={{ fontSize: "13px" }}
                            >
                              {t(`solutions_${itemKey}` as Parameters<typeof t>[0])}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
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
              );
            })}
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
