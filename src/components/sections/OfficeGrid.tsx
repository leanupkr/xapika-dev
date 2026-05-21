"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight, MapPin } from "lucide-react";
import { isOfficeComing } from "@/lib/officeStatus";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export type OfficeGridItem = {
  id: string;
  city: string;
  country: string;
  flag: string;
  role: "headquarters" | "office" | "warehouse";
  since: string;
  lat: number;
  lng: number;
  blurb: string;
  address?: string;
  mapsUrl?: string;
};

export type OfficeGridProps = {
  overline: string;
  title: string;
  subtitle: string;
  hqLabel: string;
  officeLabel: string;
  warehouseLabel: string;
  sinceLabel: string;
  comingLabel: string;
  googleMapsLink: string;
  offices: ReadonlyArray<OfficeGridItem>;
};

function googleMapsHref(city: string, country: string) {
  const q = encodeURIComponent(`${city} ${country}`);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

export default function OfficeGrid({
  overline,
  title,
  subtitle,
  hqLabel,
  officeLabel,
  warehouseLabel,
  sinceLabel,
  comingLabel,
  googleMapsLink,
  offices,
}: OfficeGridProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.1, once: true });

  const roleLabel = (role: OfficeGridItem["role"]) =>
    role === "headquarters"
      ? hqLabel
      : role === "warehouse"
        ? warehouseLabel
        : officeLabel;

  return (
    <section
      ref={ref}
      id="directory"
      data-bg="light"
      className="relative scroll-mt-24"
      style={{
        backgroundColor: "rgb(var(--color-bg))",
        paddingTop: "clamp(4rem, 8vh, 6rem)",
        paddingBottom: "clamp(4rem, 8vh, 6rem)",
      }}
      aria-labelledby="office-grid-title"
    >
      <div
        className="relative mx-auto px-6 md:px-10 lg:px-16"
        style={{ maxWidth: "var(--max-width)" }}
      >
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 md:mb-16 items-end">
          <div className="lg:col-span-7">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : undefined}
              transition={{ duration: 0.5, ease: EASE }}
              className="flex items-center gap-3 font-heading font-medium uppercase mb-5 text-[rgb(var(--color-primary))]"
              style={{ fontSize: "13px", letterSpacing: "0.22em" }}
            >
              <span
                aria-hidden
                className="inline-block flex-shrink-0"
                style={{
                  width: "24px",
                  height: "2px",
                  backgroundColor: "rgb(var(--color-primary))",
                }}
              />
              {overline}
            </motion.span>

            <motion.h2
              id="office-grid-title"
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
              className="font-heading font-semibold mb-4"
              style={{
                fontSize: "clamp(1.875rem, 3.6vw, 2.75rem)",
                color: "rgb(var(--color-ink))",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
              }}
            >
              {title}
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.6, delay: 0.18, ease: EASE }}
            className="lg:col-span-5 font-body"
            style={{
              fontSize: "clamp(0.9375rem, 1.05vw, 1rem)",
              lineHeight: 1.65,
              color: "rgba(11,31,58,0.62)",
              maxWidth: "440px",
            }}
          >
            {subtitle}
          </motion.p>
        </div>

        {/* Card grid — mobile bento: HQ full-width, remaining 2-col compact */}
        <ul
          role="list"
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5"
        >
          {offices.map((o, i) => (
            <OfficeCard
              key={o.id}
              office={o}
              index={i}
              inView={inView}
              roleLabel={roleLabel(o.role)}
              sinceLabel={sinceLabel}
              comingLabel={comingLabel}
              googleMapsLink={googleMapsLink}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}

function OfficeCard({
  office,
  index,
  inView,
  roleLabel,
  sinceLabel,
  comingLabel,
  googleMapsLink,
}: {
  office: OfficeGridItem;
  index: number;
  inView: boolean;
  roleLabel: string;
  sinceLabel: string;
  comingLabel: string;
  googleMapsLink: string;
}) {
  const [hovered, setHovered] = useState(false);
  const isHQ = office.role === "headquarters";
  const coming = isOfficeComing(office.since);
  const mapsHref = office.mapsUrl ?? googleMapsHref(office.city, office.country);
  const periodLabel = coming ? comingLabel : sinceLabel;

  return (
    <motion.li
      id={office.id}
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.55, delay: 0.04 * index, ease: EASE }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group relative flex flex-col scroll-mt-28 p-4 sm:p-[22px] sm:pb-5 ${
        isHQ ? "col-span-2 sm:col-span-2 lg:col-span-1" : ""
      }`}
      style={{
        backgroundColor: "rgb(var(--color-surface))",
        border: `1px solid ${
          hovered
            ? "rgba(246,163,23,0.55)"
            : isHQ
              ? "rgba(246,163,23,0.30)"
              : "rgba(11,31,58,0.10)"
        }`,
        borderRadius: "10px",
        transition:
          "border-color 0.3s var(--ease-out), transform 0.3s var(--ease-out), box-shadow 0.3s var(--ease-out)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 14px 32px rgba(11,31,58,0.10)"
          : "0 1px 0 rgba(11,31,58,0.02)",
      }}
    >
      {/* HQ accent bar */}
      {isHQ && (
        <span
          aria-hidden
          className="absolute left-0 top-5 bottom-5 rounded-r-sm"
          style={{
            width: "3px",
            backgroundColor: "rgb(var(--color-primary))",
          }}
        />
      )}

      {/* Top: flag + role chip */}
      <div className="flex items-start justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
        <span
          aria-hidden
          className="inline-flex items-center justify-center text-[22px] sm:text-[30px]"
          style={{
            lineHeight: 1,
            transform: hovered ? "scale(1.08) rotate(-3deg)" : "none",
            transformOrigin: "center",
            transition: "transform 0.35s var(--ease-out)",
            filter: "drop-shadow(0 2px 4px rgba(11,31,58,0.12))",
          }}
        >
          {office.flag}
        </span>
        <span
          className="font-heading uppercase whitespace-nowrap text-[9px] sm:text-[10px]"
          style={{
            letterSpacing: "0.18em",
            padding: "3px 8px",
            border: `1px solid ${
              isHQ ? "rgba(246,163,23,0.45)" : "rgba(11,31,58,0.18)"
            }`,
            borderRadius: "999px",
            color: isHQ ? "rgb(var(--color-primary))" : "rgba(11,31,58,0.65)",
            backgroundColor: isHQ ? "rgba(246,163,23,0.07)" : "transparent",
          }}
        >
          {roleLabel}
        </span>
      </div>

      {/* City + country */}
      <h3
        className="font-heading font-semibold text-[18px] sm:text-[22px]"
        style={{
          color: "rgb(var(--color-ink))",
          letterSpacing: "-0.01em",
          lineHeight: 1.15,
          marginBottom: "4px",
        }}
      >
        {office.city}
      </h3>
      <div
        className="font-heading uppercase mb-2.5 sm:mb-3 text-[10px] sm:text-[11px]"
        style={{
          letterSpacing: "0.16em",
          color: "rgba(11,31,58,0.55)",
        }}
      >
        {office.country}
      </div>

      {/* Period */}
      <div
        className="font-heading mb-3 sm:mb-4 text-[11px] sm:text-[12px]"
        style={{
          color: coming ? "rgb(var(--color-primary))" : "rgba(11,31,58,0.62)",
          letterSpacing: "0.04em",
        }}
      >
        <span style={{ fontWeight: 600 }}>{periodLabel}</span> {office.since}
      </div>

      {/* Blurb — 2-line clamp on mobile to keep cards compact */}
      <p
        className="font-body mb-4 sm:mb-5 text-[12px] sm:text-[13.5px] line-clamp-3 sm:line-clamp-none"
        style={{
          lineHeight: 1.55,
          color: "rgba(11,31,58,0.72)",
        }}
      >
        {office.blurb}
      </p>

      {/* HQ only: address + Maps link */}
      {isHQ && (
        <>
          <div
            className="mt-auto hidden sm:block"
            aria-label={office.address}
            style={{
              border: "1px solid rgba(11,31,58,0.12)",
              borderRadius: "6px",
              padding: "10px 12px",
              backgroundColor: "rgba(11,31,58,0.02)",
            }}
          >
            <div
              className="flex items-center gap-2 font-body"
              style={{
                fontSize: "12px",
                color: "rgba(11,31,58,0.55)",
              }}
            >
              <MapPin size={12} strokeWidth={1.75} />
              <span>{office.address}</span>
            </div>
          </div>

          <a
            href={mapsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto sm:mt-4 inline-flex items-center gap-1.5 font-heading font-medium self-start text-[11px] sm:text-[12px]"
            style={{
              color: hovered
                ? "rgb(var(--color-primary))"
                : "rgba(11,31,58,0.78)",
              letterSpacing: "0.02em",
              transition: "color 0.25s var(--ease-out)",
            }}
          >
            {googleMapsLink}
            <ArrowUpRight
              size={12}
              strokeWidth={1.75}
              style={{
                transform: hovered ? "translate(2px, -2px)" : "none",
                transition: "transform 0.3s var(--ease-out)",
              }}
            />
          </a>
        </>
      )}
    </motion.li>
  );
}
