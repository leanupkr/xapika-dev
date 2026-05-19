"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

// Sub-items share the same href/key shape — reuse a minimal type
type SubItem = {
  key: string;
  href: string;
};

const ABOUT_SUB: SubItem[] = [
  { key: "about_ceo",          href: "/about/ceo" },
  { key: "about_history",      href: "/about/history" },
  { key: "about_vision",       href: "/about/vision" },
  { key: "about_organization", href: "/about/organization" },
  { key: "about_clients",      href: "/about/clients" },
];

const SOLUTIONS_SUB: SubItem[] = [
  { key: "solutions_light_maintenance", href: "/solutions/light-maintenance" },
  { key: "solutions_heavy_maintenance", href: "/solutions/heavy-maintenance" },
  { key: "solutions_supply_chain",      href: "/solutions/supply-chain" },
  { key: "solutions_digital_asset",     href: "/solutions/digital-asset-management" },
  { key: "solutions_commercial",        href: "/solutions/commercial-services" },
];

const PORTFOLIOS_SUB: SubItem[] = [
  { key: "portfolios_ukraine",    href: "/portfolios/ukraine-emu" },
  { key: "portfolios_warsaw",     href: "/portfolios/warsaw-tram" },
  { key: "portfolios_uzbekistan", href: "/portfolios/uzbekistan-rail" },
  { key: "portfolios_all",        href: "/portfolios" },
];

const NAV_LINKS = [
  { key: "about",      href: "/about",      subItems: ABOUT_SUB },
  { key: "solutions",  href: "/solutions",  subItems: SOLUTIONS_SUB },
  { key: "portfolios", href: "/portfolios", subItems: PORTFOLIOS_SUB },
  { key: "locations",  href: "/locations",  subItems: null },
  { key: "contact",    href: "/contact",    subItems: null },
] as const;

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function MobileMenu({ isOpen, onClose }: Props) {
  const t = useTranslations("nav");
  const pathname = usePathname();

  const labelId = useId();
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  const [expanded, setExpanded] = useState<string | null>(null);

  function toggleExpanded(key: string) {
    setExpanded((prev) => (prev === key ? null : key));
  }

  // Lock body scroll, ESC to close, focus trap, restore focus on close
  useEffect(() => {
    if (!isOpen) return;

    // Reset accordion on open
    setExpanded(null);

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    const focusFrame = requestAnimationFrame(() => closeBtnRef.current?.focus());

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !drawerRef.current) return;
      // Re-query each time so newly revealed sub-links are included
      const focusables = drawerRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      previouslyFocusedRef.current?.focus();
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            ref={drawerRef}
            id="mobile-menu-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelId}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-ink flex flex-col overflow-y-auto"
            data-bg="dark"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 h-20 flex-shrink-0">
              <span
                id={labelId}
                className="text-white font-heading font-semibold tracking-wider uppercase"
                style={{ fontSize: "0.8125rem" }}
              >
                Menu
              </span>
              <button
                ref={closeBtnRef}
                onClick={onClose}
                aria-label="Close menu"
                className="text-white/70 hover:text-white transition-colors duration-200 p-2 -mr-2"
              >
                <X size={24} strokeWidth={1.5} aria-hidden="true" />
              </button>
            </div>

            {/* Divider */}
            <div className="h-px bg-white/10 mx-6 flex-shrink-0" aria-hidden="true" />

            {/* Navigation links */}
            <nav className="flex-1 px-6 py-6" aria-label="Primary">
              <ul className="space-y-0">
                {NAV_LINKS.map(({ key, href, subItems }, index) => {
                  const isActive =
                    pathname === href || pathname.startsWith(`${href}/`);
                  const isExpanded = expanded === key;

                  if (subItems) {
                    return (
                      <motion.li
                        key={key}
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: 0.08 + index * 0.06,
                          duration: 0.32,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="border-b border-white/8"
                      >
                        <button
                          onClick={() => toggleExpanded(key)}
                          aria-expanded={isExpanded}
                          className={[
                            "flex items-center justify-between w-full py-4",
                            "font-heading font-medium tracking-widest uppercase transition-colors duration-200",
                            isActive || isExpanded ? "text-primary" : "text-white/80 hover:text-white",
                          ].join(" ")}
                          style={{ fontSize: "1.125rem" }}
                        >
                          {t(key as Parameters<typeof t>[0])}
                          <ChevronDown
                            size={16}
                            strokeWidth={2}
                            className={[
                              "transition-transform duration-200 text-white/40",
                              isExpanded ? "rotate-180" : "",
                            ].join(" ")}
                            aria-hidden="true"
                          />
                        </button>

                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.ul
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{
                                duration: 0.22,
                                ease: [0.16, 1, 0.3, 1],
                              }}
                              className="overflow-hidden pl-2 pb-3 space-y-0.5"
                            >
                              {(subItems as SubItem[]).map((item) => {
                                const subActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                                return (
                                  <li key={item.key}>
                                    <Link
                                      href={item.href}
                                      onClick={onClose}
                                      aria-current={subActive ? "page" : undefined}
                                      className={[
                                        "block py-2 px-3 rounded text-sm font-heading transition-colors duration-200",
                                        subActive
                                          ? "text-primary"
                                          : "text-white/55 hover:text-white",
                                      ].join(" ")}
                                    >
                                      {t(item.key as Parameters<typeof t>[0])}
                                    </Link>
                                  </li>
                                );
                              })}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </motion.li>
                    );
                  }

                  // Plain link (Contact)
                  return (
                    <motion.li
                      key={key}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.08 + index * 0.06,
                        duration: 0.32,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <Link
                        href={href}
                        onClick={onClose}
                        aria-current={isActive ? "page" : undefined}
                        className="block py-4 text-white/80 hover:text-white font-heading font-medium tracking-widest uppercase transition-colors duration-200 aria-[current=page]:text-primary"
                        style={{ fontSize: "1.125rem" }}
                      >
                        {t(key as Parameters<typeof t>[0])}
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
