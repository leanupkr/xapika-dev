"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Menu, ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import MobileMenu from "./MobileMenu";
import MegaDropdown from "./MegaDropdown";
import { EASE } from "@/lib/motion";
import { NAV_ITEMS } from "@/data/nav";

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
        transition={{ duration: 0.5, ease: EASE }}
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
              className="hidden lg:flex items-center gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              aria-label="Primary"
            >
              {NAV_ITEMS.map((item) => {
                const isActive =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);
                const dropdown = item.children;

                if (dropdown) {
                  return (
                    <div
                      key={item.key}
                      className="relative"
                      onMouseEnter={() => handleEnter(item.key)}
                      onMouseLeave={handleLeave}
                    >
                      <button
                        ref={(el) => {
                          triggerRefs.current[item.key] = el;
                        }}
                        id={`${item.key}-trigger`}
                        className={[
                          "relative flex items-center gap-1 whitespace-nowrap font-heading font-medium tracking-[0.05em] uppercase transition-colors duration-200",
                          "after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-[2px] after:rounded-full after:transition-opacity after:duration-200",
                          isActive
                            ? "after:opacity-100 after:bg-primary"
                            : "after:opacity-0 after:bg-primary",
                          scrolled
                            ? isActive || activeMenu === item.key
                              ? "text-primary hover:text-primary"
                              : "text-ink hover:text-primary"
                            : isActive || activeMenu === item.key
                              ? "text-white hover:text-white"
                              : "text-white/90 hover:text-white",
                        ].join(" ")}
                        style={{ fontSize: "13px" }}
                        aria-expanded={activeMenu === item.key}
                        aria-haspopup="menu"
                        aria-current={isActive ? "page" : undefined}
                        onClick={() =>
                          setActiveMenu(activeMenu === item.key ? null : item.key)
                        }
                        onKeyDown={(e) => handleTriggerKeyDown(e, item.key)}
                      >
                        {item.label}
                        <ChevronDown
                          size={14}
                          strokeWidth={2}
                          className={[
                            "transition-transform duration-200",
                            activeMenu === item.key ? "rotate-180" : "",
                          ].join(" ")}
                          aria-hidden="true"
                        />
                      </button>

                      <MegaDropdown
                        triggerId={`${item.key}-trigger`}
                        items={dropdown}
                        isOpen={activeMenu === item.key}
                        onClose={closeMenu}
                        onEnter={() => handleEnter(item.key)}
                        onLeave={handleLeave}
                        layout="compact"
                      />
                    </div>
                  );
                }

                // Plain link (Locations, Contact)
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={[
                      "relative whitespace-nowrap font-heading font-medium tracking-[0.05em] uppercase transition-colors duration-200",
                      "after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-[2px] after:rounded-full after:transition-opacity after:duration-200",
                      isActive
                        ? "after:opacity-100 after:bg-primary"
                        : "after:opacity-0 after:bg-primary",
                      scrolled
                        ? isActive
                          ? "text-primary hover:text-primary"
                          : "text-ink hover:text-primary"
                        : isActive
                          ? "text-white hover:text-white"
                          : "text-white/90 hover:text-white",
                    ].join(" ")}
                    style={{ fontSize: "13px" }}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Hamburger (mobile) — p-3 ensures ≥48×48px hit target; -ml-1 keeps
                slight visual alignment without pushing icon to the unsafe edge */}
            <button
              className={[
                "lg:hidden flex items-center justify-center p-3 -ml-1 transition-colors duration-200",
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
                alt=""
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
