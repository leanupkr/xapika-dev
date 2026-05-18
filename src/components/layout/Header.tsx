"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Menu,
  ChevronDown,
  UserSquare2,
  Clock,
  Compass,
  Network,
  Handshake,
  Lightbulb,
  Wrench,
  Truck,
  Database,
  Store,
  Train,
  TramFront,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import MobileMenu from "./MobileMenu";
import MegaDropdown, { type MegaDropdownItem } from "./MegaDropdown";

const NAV_LINKS = [
  { key: "about",      href: "/about" },
  { key: "solutions",  href: "/solutions" },
  { key: "portfolios", href: "/portfolios" },
  { key: "locations",  href: "/locations" },
  { key: "contact",    href: "/contact" },
] as const;

export default function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- i18n-aware dropdown items (built inside component for t() access) ---
  const aboutItems: MegaDropdownItem[] = [
    { key: "ceo",          label: t("about_ceo"),          description: t("about_ceo_desc"),          href: "/about/ceo",          icon: UserSquare2 },
    { key: "history",      label: t("about_history"),      description: t("about_history_desc"),      href: "/about/history",      icon: Clock },
    { key: "vision",       label: t("about_vision"),       description: t("about_vision_desc"),       href: "/about/vision",       icon: Compass },
    { key: "organization", label: t("about_organization"), description: t("about_organization_desc"), href: "/about/organization", icon: Network },
    { key: "clients",      label: t("about_clients"),      description: t("about_clients_desc"),      href: "/about/clients",      icon: Handshake },
  ];

  const solutionsItems: MegaDropdownItem[] = [
    { key: "light_maintenance", label: t("solutions_light_maintenance"), description: t("solutions_light_maintenance_desc"), href: "/solutions/light-maintenance",       icon: Lightbulb },
    { key: "heavy_maintenance", label: t("solutions_heavy_maintenance"), description: t("solutions_heavy_maintenance_desc"), href: "/solutions/heavy-maintenance",       icon: Wrench },
    { key: "supply_chain",      label: t("solutions_supply_chain"),      description: t("solutions_supply_chain_desc"),      href: "/solutions/supply-chain",            icon: Truck },
    { key: "digital_asset",     label: t("solutions_digital_asset"),     description: t("solutions_digital_asset_desc"),     href: "/solutions/digital-asset-management",icon: Database },
    { key: "commercial",        label: t("solutions_commercial"),        description: t("solutions_commercial_desc"),        href: "/solutions/commercial-services",     icon: Store },
  ];

  const portfoliosItems: MegaDropdownItem[] = [
    { key: "ukraine",    label: t("portfolios_ukraine"),    description: t("portfolios_ukraine_desc"),    href: "/portfolios/ukraine-emu",     icon: Train },
    { key: "warsaw",     label: t("portfolios_warsaw"),     description: t("portfolios_warsaw_desc"),     href: "/portfolios/warsaw-tram",     icon: TramFront },
    { key: "uzbekistan", label: t("portfolios_uzbekistan"), description: t("portfolios_uzbekistan_desc"), href: "/portfolios/uzbekistan-rail", icon: Sparkles },
    { key: "all",        label: t("portfolios_all"),        description: t("portfolios_all_desc"),        href: "/portfolios",                 icon: ArrowUpRight },
  ];

  const dropdownByKey: Record<string, MegaDropdownItem[] | null> = {
    about:      aboutItems,
    solutions:  solutionsItems,
    portfolios: portfoliosItems,
    locations:  null,
    contact:    null,
  };

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

  function switchLocale(nextLocale: string) {
    router.replace(pathname, { locale: nextLocale });
  }

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
                        {t(key as Parameters<typeof t>[0])}
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
                    {t(key as Parameters<typeof t>[0])}
                  </Link>
                );
              })}
            </nav>

            {/* Hamburger (mobile) */}
            <button
              className={[
                "md:hidden p-2.5 -ml-2 transition-colors duration-200",
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

          {/* Right group: Locale switcher (desktop) + Logo */}
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
                    aria-label={
                      lng === "ko" ? "한국어로 전환" : "Switch to English"
                    }
                    className={[
                      "font-heading font-medium tracking-[0.05em] uppercase transition-colors duration-200",
                      "min-h-[44px] min-w-[44px] flex items-center justify-center",
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
