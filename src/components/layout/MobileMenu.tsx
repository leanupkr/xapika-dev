"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { useParams } from "next/navigation";

const NAV_LINKS = [
  { key: "about", href: "/about" },
  { key: "solutions", href: "/solutions" },
  { key: "portfolios", href: "/portfolios" },
  { key: "locations", href: "/locations" },
  { key: "contact", href: "/contact" },
] as const;

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function MobileMenu({ isOpen, onClose }: Props) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  function switchLocale(nextLocale: string) {
    router.replace(pathname, { locale: nextLocale });
    onClose();
  }

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
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-ink flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 h-20">
              <span
                className="text-white font-heading font-semibold tracking-wider uppercase"
                style={{ fontSize: "0.8125rem" }}
              >
                Menu
              </span>
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="text-white/70 hover:text-white transition-colors duration-200 p-2 -mr-2"
              >
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            {/* Divider */}
            <div className="h-px bg-white/10 mx-6" />

            {/* Navigation links */}
            <nav className="flex-1 flex flex-col justify-center px-6">
              <ul className="space-y-1">
                {NAV_LINKS.map(({ key, href }, index) => (
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
                      className="block py-4 text-white/80 hover:text-white font-heading font-medium tracking-widest uppercase transition-colors duration-200"
                      style={{ fontSize: "1.125rem" }}
                    >
                      {t(key)}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>

            {/* Language toggle */}
            <div className="px-6 pb-10 pt-6 border-t border-white/10">
              <div className="flex items-center gap-3">
                <span
                  className="text-white/40 font-heading uppercase tracking-wider"
                  style={{ fontSize: "0.75rem" }}
                >
                  Language
                </span>
                <div className="flex items-center gap-2">
                  {(["en", "ko"] as const).map((lng) => (
                    <button
                      key={lng}
                      onClick={() => switchLocale(lng)}
                      className={[
                        "font-heading font-medium tracking-widest uppercase transition-colors duration-200",
                        locale === lng
                          ? "text-primary"
                          : "text-white/50 hover:text-white",
                      ].join(" ")}
                      style={{ fontSize: "0.8125rem" }}
                    >
                      {lng.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
