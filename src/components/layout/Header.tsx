"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Menu, ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import MobileMenu from "./MobileMenu";
import MegaDropdown, { type MegaDropdownItem } from "./MegaDropdown";

const NAV_LABELS: Record<string, string> = {
  about:      "About Us",
  solutions:  "Solutions",
  portfolios: "Portfolios",
  locations:  "Locations",
  contact:    "Contact Us",
};

const NAV_LINKS = [
  { key: "about",      href: "/about" },
  { key: "solutions",  href: "/solutions" },
  { key: "portfolios", href: "/portfolios" },
  { key: "locations",  href: "/locations" },
  { key: "contact",    href: "/contact" },
] as const;

const aboutItems: MegaDropdownItem[] = [
  { key: "ceo",          label: "CEO Message",         description: "A note from the founder.",         href: "/about/ceo" },
  { key: "history",      label: "Our History",         description: "Ten years across five countries.", href: "/about/history" },
  { key: "vision",       label: "Vision & Principles", description: "Perfect work, safe operations.",   href: "/about/vision" },
  { key: "organization", label: "Organization",        description: "Cross-functional teams.",          href: "/about/organization" },
  { key: "clients",      label: "Our Clients",         description: "National rail operators.",         href: "/about/clients" },
];

const solutionsItems: MegaDropdownItem[] = [
  { key: "light_maintenance", label: "Light Maintenance",        description: "Daily inspections & functional checks.", href: "/solutions/light-maintenance" },
  { key: "heavy_maintenance", label: "Heavy Maintenance",        description: "Full overhauls under warranty.",         href: "/solutions/heavy-maintenance" },
  { key: "supply_chain",      label: "Supply Chain",             description: "Parts sourcing across 50+ partners.",    href: "/solutions/supply-chain" },
  { key: "digital_asset",     label: "Digital Asset Management", description: "MMIS platform via VISION IT.",           href: "/solutions/digital-asset-management" },
  { key: "commercial",        label: "Commercial Services",      description: "Station retail & concessions.",          href: "/solutions/commercial-services" },
];

const portfoliosItems: MegaDropdownItem[] = [
  { key: "ukraine",    label: "Ukraine HRCS2 EMU",    description: "100 high-speed units · since 2017.", href: "/portfolios/ukraine-emu" },
  { key: "warsaw",     label: "Tramwaje Warszawskie", description: "123 trams · 140-year network.",       href: "/portfolios/warsaw-tram" },
  { key: "uzbekistan", label: "Uzbekistan HSR",       description: "Launching May 2026.",                 href: "/portfolios/uzbekistan-rail" },
  { key: "all",        label: "View All Portfolios",  description: "Complete portfolio overview.",        href: "/portfolios" },
];

const dropdownByKey: Record<string, MegaDropdownItem[] | null> = {
  about:      aboutItems,
  solutions:  solutionsItems,
  portfolios: portfoliosItems,
  locations:  null,
  contact:    null,
};

export default function Header() {
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- Scroll listener ---
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 16);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // --- Click outside to close ---
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    }
    function onFocusOutside(e: FocusEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("focusin", onFocusOutside);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("focusin", onFocusOutside);
    };
  }, []);

  function handleEnter(menu: string) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveMenu(menu);
  }

  function handleLeave() {
    closeTimer.current = setTimeout(() => setActiveMenu(null), 120);
  }

  function closeMenu() {
    setActiveMenu(null);
  }

  function handleTriggerKeyDown(
    e: React.KeyboardEvent<HTMLButtonElement>,
    menuKey: string
  ) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (activeMenu === menuKey) {
        setActiveMenu(null);
      } else {
        setActiveMenu(menuKey);
        requestAnimationFrame(() => {
          const container = triggerRefs.current[menuKey]?.parentElement;
          const first = container?.querySelector<HTMLElement>('[role="menuitem"]');
          first?.focus();
        });
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveMenu(menuKey);
      requestAnimationFrame(() => {
        const container = triggerRefs.current[menuKey]?.parentElement;
        const first = container?.querySelector<HTMLElement>('[role="menuitem"]');
        first?.focus();
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveMenu(menuKey);
      requestAnimationFrame(() => {
        const container = triggerRefs.current[menuKey]?.parentElement;
        const items = container?.querySelectorAll<HTMLElement>('[role="menuitem"]');
        items?.[items.length - 1]?.focus();
      });
    } else if (e.key === "Escape") {
      setActiveMenu(null);
    }
  }

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
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
          className="relative mx-auto flex h-full items-center justify-between px-6"
          style={{ maxWidth: "var(--max-width)" }}
        >
          {/* Left group: Mobile hamburger (desktop has no left content; nav is centered) */}
          <div className="flex items-center">
            {/* Desktop nav — absolutely centered */}
            <nav
              ref={containerRef}
              className="hidden md:flex items-center gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              aria-label="Primary"
            >
              {NAV_LINKS.map(({ key, href }) => {
                const isActive =
                  pathname === href || pathname.startsWith(`${href}/`);
                const dropdown = dropdownByKey[key];

                if (dropdown) {
                  return (
                    <div
                      key={key}
                      className="relative"
                      onMouseEnter={() => handleEnter(key)}
                      onMouseLeave={handleLeave}
                    >
                      <button
                        ref={(el) => {
                          triggerRefs.current[key] = el;
                        }}
                        id={`${key}-trigger`}
                        className={[
                          "flex items-center gap-1 font-heading font-medium tracking-[0.05em] uppercase transition-colors duration-200",
                          scrolled
                            ? "text-ink hover:text-primary"
                            : "text-white/90 hover:text-white",
                          activeMenu === key
                            ? scrolled
                              ? "text-primary"
                              : "text-white"
                            : "",
                        ].join(" ")}
                        style={{ fontSize: "13px" }}
                        aria-expanded={activeMenu === key}
                        aria-haspopup="menu"
                        aria-current={isActive ? "page" : undefined}
                        onClick={() =>
                          setActiveMenu(activeMenu === key ? null : key)
                        }
                        onKeyDown={(e) => handleTriggerKeyDown(e, key)}
                      >
                        {NAV_LABELS[key]}
                        <ChevronDown
                          size={14}
                          strokeWidth={2}
                          className={[
                            "transition-transform duration-200",
                            activeMenu === key ? "rotate-180" : "",
                          ].join(" ")}
                          aria-hidden="true"
                        />
                      </button>

                      <MegaDropdown
                        triggerId={`${key}-trigger`}
                        items={dropdown}
                        isOpen={activeMenu === key}
                        onClose={closeMenu}
                        onEnter={() => handleEnter(key)}
                        onLeave={handleLeave}
                        layout="compact"
                      />
                    </div>
                  );
                }

                // Plain link (Contact)
                return (
                  <Link
                    key={key}
                    href={href}
                    aria-current={isActive ? "page" : undefined}
                    className={[
                      "font-heading font-medium tracking-[0.05em] uppercase transition-colors duration-200",
                      scrolled
                        ? "text-ink hover:text-primary"
                        : "text-white/90 hover:text-white",
                    ].join(" ")}
                    style={{ fontSize: "13px" }}
                  >
                    {NAV_LABELS[key]}
                  </Link>
                );
              })}
            </nav>

            {/* Hamburger (mobile) — p-3 ensures ≥48×48px hit target; -ml-1 keeps
                slight visual alignment without pushing icon to the unsafe edge */}
            <button
              className={[
                "md:hidden p-3 -ml-1 transition-colors duration-200",
                scrolled
                  ? "text-ink hover:text-primary"
                  : "text-white hover:text-white/70",
              ].join(" ")}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu-drawer"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={24} strokeWidth={1.5} />
            </button>
          </div>

          {/* Right group: Logo */}
          <div className="flex items-center gap-4">
            {/* Logo */}
            <Link
              href="/"
              className="flex-shrink-0"
              aria-label="Xapika Engineering — Home"
            >
              <Image
                src={scrolled ? "/logo.png" : "/logo-white.png"}
                alt="Xapika Engineering"
                width={120}
                height={32}
                className="object-contain transition-opacity duration-300"
                style={{ height: "32px", width: "auto" }}
              />
            </Link>
          </div>
        </div>
      </motion.header>

      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
