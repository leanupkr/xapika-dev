"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Props = {
  href: string;
  label: string;
  description?: string;
  onClick?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLAnchorElement>) => void;
};

export default function MegaDropdownItem({
  href,
  label,
  description,
  onClick,
  onKeyDown,
}: Props) {
  return (
    <Link
      href={href}
      role="menuitem"
      onClick={onClick}
      onKeyDown={onKeyDown}
      className={[
        "group flex items-center gap-3 px-4 rounded-md transition-all duration-150",
        "relative border-l-2 border-transparent",
        "hover:bg-[rgba(246,163,23,0.06)] hover:border-l-primary",
        "focus:outline-none focus-visible:bg-[rgba(246,163,23,0.06)] focus-visible:border-l-primary",
        description ? "py-3" : "py-2.5",
      ].join(" ")}
      style={{ fontSize: "13px" }}
    >
      {/* Text */}
      <span className="flex-1 min-w-0">
        <span
          className="block font-heading font-medium text-ink truncate transition-colors duration-150 group-hover:text-ink group-focus-visible:text-ink"
          style={{ fontSize: "13px", lineHeight: "1.3" }}
        >
          {label}
        </span>
        {description && (
          <span
            className="block font-body text-ink/50 truncate mt-0.5"
            style={{ fontSize: "11px", lineHeight: "1.4" }}
          >
            {description}
          </span>
        )}
      </span>

      {/* Arrow */}
      <ArrowRight
        size={12}
        strokeWidth={2}
        className={[
          "flex-shrink-0 text-ink/20 transition-all duration-150",
          "group-hover:text-primary group-hover:translate-x-0.5",
          "group-focus-visible:text-primary group-focus-visible:translate-x-0.5",
        ].join(" ")}
        aria-hidden="true"
      />
    </Link>
  );
}
