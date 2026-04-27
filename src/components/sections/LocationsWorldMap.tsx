"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export type WorldMapOffice = {
  id: string;
  city: string;
  country: string;
  role: "headquarters" | "office" | "warehouse";
  since: string;
  lat: number;
  lng: number;
  blurb: string;
};

export type LocationsWorldMapProps = {
  overline: string;
  title: string;
  subtitle: string;
  hqLabel: string;
  officeLabel: string;
  warehouseLabel: string;
  sinceLabel: string;
  legendHq: string;
  legendOffice: string;
  liveTag: string;
  offices: ReadonlyArray<WorldMapOffice>;
};

export default function LocationsWorldMap({
  overline,
  title,
  subtitle,
  hqLabel,
  officeLabel,
  warehouseLabel,
  sinceLabel,
  legendHq,
  legendOffice,
  liveTag,
  offices,
}: LocationsWorldMapProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.15, once: true });
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 1023px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const roleLabel = (role: WorldMapOffice["role"]) =>
    role === "headquarters"
      ? hqLabel
      : role === "warehouse"
        ? warehouseLabel
        : officeLabel;

  const active = offices.find((o) => o.id === activeId) ?? null;

  return (
    <section
      ref={ref}
      data-bg="dark"
      className="relative overflow-hidden"
      style={{
        backgroundColor: "rgb(var(--color-ink))",
        paddingTop: "clamp(4rem, 8vh, 6rem)",
        paddingBottom: "clamp(4rem, 8vh, 6rem)",
      }}
      aria-labelledby="locations-map-title"
    >
      {/* Top hairline */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0"
        style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.06)" }}
      />

      {/* Subtle grid */}
      <svg
        aria-hidden
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.04 }}
      >
        <defs>
          <pattern
            id="rail-grid-locations-map"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <line x1="20" y1="0" x2="20" y2="80" stroke="#fff" strokeWidth="1" />
            <line x1="60" y1="0" x2="60" y2="80" stroke="#fff" strokeWidth="1" />
            <line x1="10" y1="20" x2="70" y2="20" stroke="#fff" strokeWidth="1" />
            <line x1="10" y1="50" x2="70" y2="50" stroke="#fff" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#rail-grid-locations-map)" />
      </svg>

      {/* Right primary glow */}
      <div
        aria-hidden
        className="absolute top-0 right-0 w-[55%] h-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 100% 50%, rgba(246,163,23,0.08) 0%, transparent 60%)",
        }}
      />

      {/* Live polite region */}
      <p className="sr-only" aria-live="polite">
        {active ? `Active: ${active.city}, ${active.country}` : ""}
      </p>

      <div
        className="relative z-10 mx-auto px-6 md:px-10 lg:px-16 w-full"
        style={{ maxWidth: "var(--max-width)" }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left text */}
          <div className="lg:col-span-4">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : undefined}
              transition={{ duration: 0.5, ease: EASE }}
              className="flex items-center gap-3 font-heading font-medium uppercase mb-6"
              style={{
                fontSize: "13px",
                letterSpacing: "0.22em",
                color: "rgba(255,255,255,0.85)",
              }}
            >
              <span
                aria-hidden
                className="inline-block flex-shrink-0"
                style={{
                  width: "28px",
                  height: "2px",
                  backgroundColor: "rgb(var(--color-primary))",
                }}
              />
              {overline}
            </motion.span>

            <motion.h2
              id="locations-map-title"
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
              className="font-heading font-semibold text-white mb-5"
              style={{
                fontSize: "clamp(1.875rem, 3.6vw, 2.75rem)",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
              }}
            >
              {title}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
              className="font-body mb-8"
              style={{
                fontSize: "clamp(0.9375rem, 1.1vw, 1.0625rem)",
                lineHeight: 1.65,
                color: "rgba(255,255,255,0.65)",
                maxWidth: "420px",
              }}
            >
              {subtitle}
            </motion.p>

            {/* Legend */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.6, delay: 0.28, ease: EASE }}
              className="flex flex-wrap gap-x-6 gap-y-3"
            >
              <LegendDot
                size={9}
                ring
                label={legendHq}
              />
              <LegendDot size={6} label={legendOffice} />
              <div
                className="inline-flex items-center gap-2 ml-auto pointer-events-none"
                style={{
                  fontSize: "11px",
                  fontFamily: "var(--font-heading)",
                  letterSpacing: "0.2em",
                  color: "rgba(255,255,255,0.55)",
                  textTransform: "uppercase",
                }}
              >
                <span
                  aria-hidden
                  className="inline-block w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: "rgb(var(--color-primary))",
                    boxShadow: "0 0 0 3px rgba(246,163,23,0.22)",
                    animation: "livepulse 1.8s ease-in-out infinite",
                  }}
                />
                {liveTag}
              </div>
            </motion.div>
          </div>

          {/* Right map */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : undefined}
            transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
            className="lg:col-span-8 relative"
            onMouseLeave={() => setActiveId(null)}
          >
            {!mounted && (
              <div
                aria-hidden
                style={{
                  width: "100%",
                  aspectRatio: `${isMobile ? 540 : 880} / ${isMobile ? 360 : 460}`,
                }}
              />
            )}
            {mounted && (
              <ComposableMap
                projection="geoEqualEarth"
                projectionConfig={{
                  scale: isMobile ? 130 : 175,
                  center: [10, 18],
                }}
                width={isMobile ? 540 : 880}
                height={isMobile ? 360 : 460}
                style={{ width: "100%", height: "auto" }}
              >
                <Geographies geography={GEO_URL}>
                  {({ geographies }) =>
                    geographies.map((geo) => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill="rgba(255,255,255,0.07)"
                        stroke="rgba(255,255,255,0.18)"
                        strokeWidth={0.4}
                        style={{
                          default: { outline: "none" },
                          hover: { outline: "none", fill: "rgba(255,255,255,0.10)" },
                          pressed: { outline: "none" },
                        }}
                      />
                    ))
                  }
                </Geographies>

                {offices.map((o) => {
                  const isHQ = o.role === "headquarters";
                  const isActive = activeId === o.id;
                  const r = isHQ ? 5 : 3.5;
                  return (
                    <Marker
                      key={o.id}
                      coordinates={[o.lng, o.lat]}
                      onMouseEnter={() => setActiveId(o.id)}
                      onMouseLeave={() => setActiveId(null)}
                      style={{ cursor: "pointer" }}
                    >
                      {/* Hit area */}
                      <circle
                        r={r + 14}
                        fill="transparent"
                        onClick={() => setActiveId(isActive ? null : o.id)}
                        onFocus={() => setActiveId(o.id)}
                        onBlur={() => setActiveId(null)}
                        tabIndex={0}
                        style={{ cursor: "pointer" }}
                      />

                      {/* Halo (HQ always, others on active) */}
                      {(isHQ || isActive) && (
                        <circle
                          r={r + 6}
                          fill="rgba(246,163,23,0.16)"
                          stroke="rgba(246,163,23,0.55)"
                          strokeWidth={1}
                        />
                      )}

                      {/* Pulse on HQ */}
                      {isHQ && (
                        <circle
                          r={r + 4}
                          fill="none"
                          stroke="rgb(var(--color-primary))"
                          strokeWidth={1}
                          opacity={0.6}
                        >
                          <animate
                            attributeName="r"
                            from={r + 2}
                            to={r + 14}
                            dur="2.4s"
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="opacity"
                            from="0.6"
                            to="0"
                            dur="2.4s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      )}

                      {/* Dot */}
                      <circle
                        r={isActive ? r + 1 : r}
                        fill={
                          isHQ
                            ? "rgb(var(--color-primary))"
                            : "rgba(246,163,23,0.92)"
                        }
                        stroke="#ffffff"
                        strokeWidth={isHQ ? 1.6 : 1.2}
                        style={{
                          transition:
                            "r 0.25s cubic-bezier(0.4,0,0.2,1), filter 0.25s",
                          filter: isActive
                            ? "drop-shadow(0 2px 6px rgba(246,163,23,0.55))"
                            : "drop-shadow(0 1px 2px rgba(0,0,0,0.3))",
                        }}
                      />

                      {/* HQ label */}
                      {isHQ && (
                        <text
                          textAnchor="middle"
                          y={-r - 9}
                          style={{
                            fontFamily: "var(--font-heading)",
                            fontSize: "10px",
                            fontWeight: 700,
                            fill: "rgb(var(--color-primary))",
                            letterSpacing: "0.18em",
                            paintOrder: "stroke",
                            stroke: "rgba(11,31,58,0.92)",
                            strokeWidth: 3,
                            strokeLinejoin: "round",
                          }}
                        >
                          HQ
                        </text>
                      )}
                    </Marker>
                  );
                })}
              </ComposableMap>
            )}

            {/* Hover card overlay */}
            {active && (
              <div
                role="status"
                aria-live="polite"
                className="pointer-events-none absolute"
                style={{
                  bottom: "12px",
                  left: "12px",
                  right: "12px",
                  maxWidth: "360px",
                }}
              >
                <div
                  className="rounded-md backdrop-blur"
                  style={{
                    backgroundColor: "rgba(11,31,58,0.86)",
                    border: "1px solid rgba(246,163,23,0.35)",
                    padding: "14px 16px",
                    boxShadow: "0 12px 36px rgba(0,0,0,0.45)",
                  }}
                >
                  <div
                    className="flex items-center gap-2 font-heading uppercase mb-2"
                    style={{
                      fontSize: "10px",
                      letterSpacing: "0.22em",
                      color: "rgb(var(--color-primary))",
                    }}
                  >
                    <span
                      aria-hidden
                      className="inline-block"
                      style={{
                        width: "14px",
                        height: "1.5px",
                        backgroundColor: "rgb(var(--color-primary))",
                      }}
                    />
                    {roleLabel(active.role)} · {sinceLabel} {active.since}
                  </div>
                  <div
                    className="font-heading font-semibold text-white"
                    style={{
                      fontSize: "18px",
                      letterSpacing: "-0.01em",
                      lineHeight: 1.2,
                    }}
                  >
                    {active.city}
                  </div>
                  <div
                    className="font-heading mt-0.5 mb-2"
                    style={{
                      fontSize: "12px",
                      color: "rgba(255,255,255,0.55)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {active.country}
                  </div>
                  <p
                    className="font-body"
                    style={{
                      fontSize: "12.5px",
                      color: "rgba(255,255,255,0.72)",
                      lineHeight: 1.55,
                    }}
                  >
                    {active.blurb}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Bottom hairline */}
      <div
        aria-hidden
        className="absolute bottom-0 left-0 right-0"
        style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.06)" }}
      />
    </section>
  );
}

function LegendDot({
  size,
  ring,
  label,
}: {
  size: number;
  ring?: boolean;
  label: string;
}) {
  return (
    <div className="inline-flex items-center gap-2.5">
      <span
        aria-hidden
        className="relative inline-flex items-center justify-center"
        style={{ width: ring ? 18 : 14, height: ring ? 18 : 14 }}
      >
        {ring && (
          <span
            className="absolute inset-0 rounded-full"
            style={{
              border: "1px solid rgba(246,163,23,0.55)",
              backgroundColor: "rgba(246,163,23,0.16)",
            }}
          />
        )}
        <span
          className="rounded-full"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: "rgb(var(--color-primary))",
            border: "1px solid #ffffff",
          }}
        />
      </span>
      <span
        className="font-heading"
        style={{
          fontSize: "12px",
          color: "rgba(255,255,255,0.78)",
          letterSpacing: "0.06em",
        }}
      >
        {label}
      </span>
    </div>
  );
}
