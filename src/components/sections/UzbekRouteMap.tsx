"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import dynamic from "next/dynamic";
import { useMediaQuery } from "@/lib/useMediaQuery";

/* ── react-simple-maps: SSR-safe dynamic imports ─────────────────────────── */
const ComposableMap = dynamic(
  () => import("react-simple-maps").then((m) => m.ComposableMap),
  { ssr: false },
);
const Geographies = dynamic(
  () => import("react-simple-maps").then((m) => m.Geographies),
  { ssr: false },
);
const Geography = dynamic(
  () => import("react-simple-maps").then((m) => m.Geography),
  { ssr: false },
);
const Marker = dynamic(
  () => import("react-simple-maps").then((m) => m.Marker),
  { ssr: false },
);
const Line = dynamic(
  () => import("react-simple-maps").then((m) => m.Line),
  { ssr: false },
);

/* ── Constants ───────────────────────────────────────────────────────────── */
const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

/** numericId → ISO numeric from Natural Earth / world-atlas */
const HIGHLIGHT_COUNTRIES: Record<string, string> = {
  "860": "uzbekistan", // UZB
  "410": "korea",      // KOR
  "616": "poland",     // POL
};

type PinId = "tashkent" | "seoul" | "warsaw";

type PinConfig = {
  id: PinId;
  coords: [number, number];
  countryId: string;
  /** Offset direction for label so pins don't overlap */
  labelAnchor: "middle" | "start" | "end";
  labelY: number; // px relative to pin center
};

const PIN_CONFIGS: PinConfig[] = [
  {
    id: "tashkent",
    coords: [69.28, 41.3],
    countryId: "860",
    labelAnchor: "middle",
    labelY: -14,
  },
  {
    id: "seoul",
    coords: [126.98, 37.57],
    countryId: "410",
    labelAnchor: "middle",
    labelY: -14,
  },
  {
    id: "warsaw",
    coords: [21.0118, 52.2297],
    countryId: "616",
    labelAnchor: "middle",
    labelY: -14,
  },
];

/**
 * The two corridor segments:
 *  Warsaw ─── Tashkent ─── Seoul
 * Rendered as two separate Lines so each can stagger their draw animation.
 */
const CORRIDOR_SEGMENTS: [PinId, PinId][] = [
  ["warsaw", "tashkent"],
  ["tashkent", "seoul"],
];

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const DOT_R = 5;

/* ── Prop types ──────────────────────────────────────────────────────────── */
export type UzbekRouteMapProps = {
  overline: string;
  title: string;
  subtitle: string;
  pins: {
    tashkent: string;
    seoul: string;
    warsaw: string;
  };
};

/* ── Component ───────────────────────────────────────────────────────────── */
export default function UzbekRouteMap({
  overline,
  title,
  subtitle,
  pins,
}: UzbekRouteMapProps): React.JSX.Element {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0, once: true });

  const [hasEntered, setHasEntered] = useState(true);
  const [mounted, setMounted] = useState(false);

  const isMobile = useMediaQuery("(max-width: 1023px)");
  const prefersReducedMotion = useMediaQuery(
    "(prefers-reduced-motion: reduce)",
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (inView && !hasEntered) setHasEntered(true);
  }, [inView, hasEntered]);

  /* Map dimensions */
  const mapWidth = 800;
  const mapHeight = 500;

  const coordsOf = (id: PinId): [number, number] =>
    PIN_CONFIGS.find((p) => p.id === id)!.coords;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="uzbek-route-map-title"
      className="relative overflow-hidden"
      style={{
        backgroundColor: "rgb(var(--color-ink))",
        paddingTop: "clamp(5rem, 12vh, 8rem)",
        paddingBottom: "clamp(5rem, 12vh, 8rem)",
      }}
    >
      {/* Radial glow — subtle warm bloom behind the map */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 62% 52%, rgba(246,163,23,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Thin top border line — adds structure on dark bg */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0"
        style={{
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, rgba(246,163,23,0.22) 35%, rgba(246,163,23,0.22) 65%, transparent)",
        }}
      />

      <div
        className="relative mx-auto px-6 md:px-10 lg:px-16"
        style={{ maxWidth: "var(--max-width-content)" }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* ── Left: Text block ── */}
          <div className="lg:col-span-5 flex flex-col">
            {/* Overline */}
            <motion.span
              initial={{ opacity: 0, x: -16 }}
              animate={hasEntered ? { opacity: 1, x: 0 } : undefined}
              transition={{ duration: 0.5, ease: EASE }}
              className="flex items-center gap-3 font-heading font-medium uppercase mb-6"
              style={{
                fontSize: "12px",
                letterSpacing: "0.22em",
                color: "rgb(var(--color-primary))",
              }}
            >
              <span
                aria-hidden
                style={{
                  display: "inline-block",
                  width: "24px",
                  height: "2px",
                  flexShrink: 0,
                  backgroundColor: "rgb(var(--color-primary))",
                }}
              />
              {overline}
            </motion.span>

            {/* Title */}
            <motion.h2
              id="uzbek-route-map-title"
              initial={{ opacity: 0, y: 20 }}
              animate={hasEntered ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
              className="font-heading font-semibold mb-5"
              style={{
                fontSize: "clamp(1.875rem, 3.6vw, 2.875rem)",
                color: "#ffffff",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
              }}
            >
              {title}
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={hasEntered ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.6, delay: 0.18, ease: EASE }}
              className="font-body mb-10"
              style={{
                fontSize: "clamp(0.9375rem, 1.1vw, 1.0625rem)",
                lineHeight: 1.68,
                color: "rgba(255,255,255,0.72)",
                maxWidth: "400px",
              }}
            >
              {subtitle}
            </motion.p>

            {/* 3-city list */}
            <motion.ul
              initial={{ opacity: 0, y: 12 }}
              animate={hasEntered ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.6, delay: 0.26, ease: EASE }}
              className="flex flex-col gap-4"
              aria-label="Corridor cities"
            >
              {PIN_CONFIGS.map((pin, i) => (
                <CityRow
                  key={pin.id}
                  label={pins[pin.id]}
                  index={i}
                  hasEntered={hasEntered}
                  prefersReducedMotion={prefersReducedMotion}
                />
              ))}
            </motion.ul>
          </div>

          {/* ── Right: Map ── */}
          <motion.div
            className="lg:col-span-7 relative"
            initial={{ opacity: 0 }}
            animate={hasEntered ? { opacity: 1 } : undefined}
            transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
          >
            {/* Microcopy badge — top-right corner */}
            <div
              aria-hidden={false}
              className="absolute top-0 right-0 z-10 flex items-center gap-2 pointer-events-none select-none"
              style={{
                fontSize: "10px",
                fontFamily: "var(--font-heading)",
                letterSpacing: "0.2em",
                color: "rgba(255,255,255,0.38)",
                textTransform: "uppercase",
              }}
            >
              3 cities · 1 corridor
            </div>

            {/* Skeleton placeholder — prevents layout shift before mount */}
            {!mounted && (
              <div
                aria-hidden
                style={{
                  width: "100%",
                  aspectRatio: `${mapWidth} / ${mapHeight}`,
                }}
              />
            )}

            {mounted && (
              <div
                aria-label="Three-country corridor map: Tashkent, Seoul, Warsaw"
                role="img"
              >
                {/*
                 * Line draw animation strategy:
                 * react-simple-maps `Line` renders as an SVG <path> with no exposed ref,
                 * so we can't animate strokeDashoffset via Framer Motion directly.
                 * Instead we wrap each <Line> in a <motion.g> that controls its CSS
                 * `animation` property via inline style: we assign a unique CSS keyframe
                 * animation (`dashReveal`) defined in GlobalPresence's global styles,
                 * delayed per segment. The line already has strokeDasharray="5 4",
                 * so the keyframe animates strokeDashoffset from total-length → 0.
                 * For browsers that don't support path.getTotalLength in SSR context,
                 * we use a large fixed offset (1200) which is safely larger than any
                 * corridor path at scale=160. The result: each segment "draws in"
                 * sequentially on viewport entry, then the dashes continue flowing
                 * via the `dashflow` CSS animation (also from GlobalPresence).
                 */}
                <ComposableMap
                  projection="geoMercator"
                  projectionConfig={{
                    center: isMobile ? [75, 43] : [60, 42],
                    scale: isMobile ? 130 : 160,
                  }}
                  width={mapWidth}
                  height={mapHeight}
                  style={{ width: "100%", height: "auto" }}
                >
                  {/* Country fills */}
                  <Geographies geography={GEO_URL}>
                    {({ geographies }) =>
                      geographies.map((geo) => {
                        const countryKey = String(geo.id);
                        const isHighlight =
                          countryKey in HIGHLIGHT_COUNTRIES;
                        return (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill={
                              isHighlight
                                ? "rgba(255,255,255,0.10)"
                                : "rgba(255,255,255,0.06)"
                            }
                            stroke="rgba(255,255,255,0.10)"
                            strokeWidth={isHighlight ? 0.7 : 0.35}
                            style={{
                              default: { outline: "none" },
                              hover: { outline: "none" },
                              pressed: { outline: "none" },
                            }}
                          />
                        );
                      })
                    }
                  </Geographies>

                  {/* Corridor lines — staggered draw-in animation */}
                  {CORRIDOR_SEGMENTS.map(([fromId, toId], segIdx) => {
                    const drawDelay = hasEntered
                      ? `${prefersReducedMotion ? 0 : 0.55 + segIdx * 0.45}s`
                      : "9999s"; // effectively hidden until entry

                    return (
                      <motion.g
                        key={`line-${fromId}-${toId}`}
                        style={{ pointerEvents: "none" }}
                      >
                        {/* Glow under-layer */}
                        <Line
                          from={coordsOf(fromId)}
                          to={coordsOf(toId)}
                          stroke="rgb(246,163,23)"
                          strokeWidth={4}
                          strokeLinecap="round"
                          style={{ opacity: 0.07 }}
                        />
                        {/* Main dashed corridor line */}
                        <Line
                          from={coordsOf(fromId)}
                          to={coordsOf(toId)}
                          stroke="rgb(var(--color-primary))"
                          strokeWidth={1.2}
                          strokeDasharray="5 4"
                          strokeLinecap="round"
                          style={{
                            opacity: hasEntered ? 1 : 0,
                            animationName: hasEntered
                              ? prefersReducedMotion
                                ? "dashflow"
                                : "dashReveal, dashflow"
                              : "none",
                            animationDuration: prefersReducedMotion
                              ? "2.2s"
                              : "0.7s, 2.2s",
                            animationDelay: prefersReducedMotion
                              ? "0s"
                              : `${drawDelay}, ${drawDelay}`,
                            animationTimingFunction: prefersReducedMotion
                              ? "linear"
                              : "cubic-bezier(0.16,1,0.3,1), linear",
                            animationFillMode: "forwards, none",
                            animationIterationCount: prefersReducedMotion
                              ? "infinite"
                              : "1, infinite",
                            transition: "opacity 0.4s",
                          }}
                        />
                      </motion.g>
                    );
                  })}

                  {/* Pins — scale-in with stagger */}
                  {PIN_CONFIGS.map((pin, pinIdx) => {
                    const dotDelay = prefersReducedMotion
                      ? 0
                      : 0.5 + pinIdx * 0.25;
                    const labelDelay = prefersReducedMotion
                      ? 0
                      : dotDelay + 0.18;

                    return (
                      <Marker key={pin.id} coordinates={pin.coords}>
                        {/* Outer ring */}
                        <motion.g
                          initial={{ scale: 0, opacity: 0 }}
                          animate={
                            hasEntered
                              ? { scale: 1, opacity: 1 }
                              : undefined
                          }
                          transition={{
                            delay: dotDelay,
                            duration: prefersReducedMotion ? 0 : 0.45,
                            ease: EASE,
                          }}
                        >
                          <circle
                            r={DOT_R + 6}
                            fill="none"
                            stroke="rgb(246,163,23)"
                            strokeWidth={1}
                            opacity={0.35}
                          >
                            {!prefersReducedMotion && (
                              <>
                                <animate
                                  attributeName="r"
                                  from={DOT_R + 2}
                                  to={DOT_R + 16}
                                  dur="2.4s"
                                  repeatCount="indefinite"
                                />
                                <animate
                                  attributeName="opacity"
                                  from="0.45"
                                  to="0"
                                  dur="2.4s"
                                  repeatCount="indefinite"
                                />
                              </>
                            )}
                          </circle>

                          {/* Static outer ring */}
                          <circle
                            r={DOT_R + 5}
                            fill="none"
                            stroke="rgb(246,163,23)"
                            strokeWidth={0.8}
                            opacity={0.3}
                          />

                          {/* Dot */}
                          <circle
                            r={DOT_R}
                            fill="rgb(246,163,23)"
                            stroke="rgb(var(--color-ink))"
                            strokeWidth={1.5}
                            style={{
                              filter:
                                "drop-shadow(0 0 6px rgba(246,163,23,0.55))",
                            }}
                          />
                        </motion.g>

                        {/* Label */}
                        <motion.g
                          initial={{ opacity: 0, y: 8 }}
                          animate={
                            hasEntered
                              ? { opacity: 1, y: 0 }
                              : undefined
                          }
                          transition={{
                            delay: labelDelay,
                            duration: prefersReducedMotion ? 0 : 0.5,
                            ease: EASE,
                          }}
                          style={{ pointerEvents: "none" }}
                        >
                          <text
                            textAnchor={pin.labelAnchor}
                            y={pin.labelY}
                            style={{
                              fontFamily: "var(--font-heading)",
                              fontSize: "10px",
                              fontWeight: 600,
                              letterSpacing: "0.16em",
                              fill: "#ffffff",
                              textTransform: "uppercase",
                              paintOrder: "stroke",
                              stroke: "rgba(11,31,58,0.85)",
                              strokeWidth: 3,
                              strokeLinejoin: "round",
                            }}
                          >
                            {pins[pin.id].toUpperCase()}
                          </text>
                        </motion.g>
                      </Marker>
                    );
                  })}
                </ComposableMap>
              </div>
            )}

            {/* CSS keyframe injection for dashReveal draw animation */}
            <style>{`
              @keyframes dashReveal {
                from { stroke-dashoffset: 1200; }
                to   { stroke-dashoffset: 0; }
              }
              @keyframes dashflow {
                from { stroke-dashoffset: 0; }
                to   { stroke-dashoffset: -36; }
              }
            `}</style>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ── City row sub-component ──────────────────────────────────────────────── */
function CityRow({
  label,
  index,
  hasEntered,
  prefersReducedMotion,
}: {
  label: string;
  index: number;
  hasEntered: boolean;
  prefersReducedMotion: boolean;
}) {
  return (
    <motion.li
      initial={{ opacity: 0, x: -12 }}
      animate={hasEntered ? { opacity: 1, x: 0 } : undefined}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.5,
        delay: prefersReducedMotion ? 0 : 0.32 + index * 0.1,
        ease: EASE,
      }}
      className="flex items-center gap-4"
    >
      {/* Orange dot */}
      <span
        aria-hidden
        style={{
          display: "inline-block",
          width: "7px",
          height: "7px",
          borderRadius: "50%",
          flexShrink: 0,
          backgroundColor: "rgb(var(--color-primary))",
          boxShadow: "0 0 0 3px rgba(246,163,23,0.18)",
        }}
      />
      <span
        className="font-heading font-medium"
        style={{
          fontSize: "14px",
          letterSpacing: "0.04em",
          color: "rgba(255,255,255,0.88)",
          lineHeight: 1.4,
        }}
      >
        {label}
      </span>
    </motion.li>
  );
}
