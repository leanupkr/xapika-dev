"use client";

import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type LucideIcon } from "lucide-react";
import MegaDropdownItem from "./MegaDropdownItem";

export type MegaDropdownItem = {
  key: string;
  label: string;
  description?: string;
  href: string;
  icon: LucideIcon;
};

type MegaDropdownProps = {
  triggerId: string;
  items: ReadonlyArray<MegaDropdownItem>;
  isOpen: boolean;
  onClose: () => void;
  onEnter: () => void;
  onLeave: () => void;
  layout?: "compact" | "wide";
};

export default function MegaDropdown({
  triggerId,
  items,
  isOpen,
  onClose,
  onEnter,
  onLeave,
  layout = "compact",
}: MegaDropdownProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  function handleKeyDown(e: React.KeyboardEvent<HTMLAnchorElement>) {
    const menu = containerRef.current?.querySelector<HTMLElement>('[role="menu"]');
    if (!menu) return;
    const allItems = Array.from(
      menu.querySelectorAll<HTMLElement>('[role="menuitem"]')
    );
    const idx = allItems.indexOf(e.currentTarget as HTMLElement);

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        allItems[(idx + 1) % allItems.length]?.focus();
        break;
      case "ArrowUp":
        e.preventDefault();
        if (idx === 0) {
          onClose();
          // Return focus to trigger
          const trigger = document.getElementById(triggerId);
          trigger?.focus();
        } else {
          allItems[idx - 1]?.focus();
        }
        break;
      case "Home":
        e.preventDefault();
        allItems[0]?.focus();
        break;
      case "End":
        e.preventDefault();
        allItems[allItems.length - 1]?.focus();
        break;
      case "Escape":
        e.preventDefault();
        onClose();
        document.getElementById(triggerId)?.focus();
        break;
      case "Tab":
        onClose();
        break;
    }
  }

  return (
    <div ref={containerRef}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className={[
              "absolute top-full left-0 mt-3 bg-white rounded-lg shadow-lg",
              "border overflow-hidden",
              layout === "wide" ? "min-w-[640px]" : "min-w-[420px]",
            ].join(" ")}
            style={{
              borderColor: "rgb(var(--color-ink) / 0.08)",
            }}
            role="menu"
            aria-labelledby={triggerId}
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
          >
            <div
              className={[
                "p-2",
                layout === "wide"
                  ? "grid grid-cols-2 gap-x-1"
                  : "flex flex-col",
              ].join(" ")}
            >
              {items.map((item) => (
                <MegaDropdownItem
                  key={item.key}
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  description={item.description}
                  onClick={onClose}
                  onKeyDown={handleKeyDown}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
