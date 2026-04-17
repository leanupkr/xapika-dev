"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line,
} from "react-simple-maps";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

type Pin = {
  id: string;
  name: string;
  label: string;
  coords: [number, number]; // [longitude, latitude]
  isHQ?: boolean;
};

const PINS: Pin[] = [
  { id: "poland", name: "Poland", label: "HQ · Kraków", coords: [19.94, 50.06], isHQ: true },
  { id: "ukraine", name: "Ukraine", label: "Kyiv", coords: [30.52, 50.45] },
  { id: "korea", name: "South Korea", label: "Seoul", coords: [126.98, 37.57] },
  { id: "uzbekistan", name: "Uzbekistan", label: "Tashkent", coords: [69.28, 41.30] },
  { id: "turkey", name: "Turkey", label: "Ankara", coords: [32.87, 39.93] },
  { id: "egypt", name: "Egypt", label: "Cairo", coords: [31.24, 30.04] },
  { id: "morocco", name: "Morocco", label: "Casablanca", coords: [-7.59, 33.57] },
];

const HQ_COORDS = PINS.find((p) => p.isHQ)!.coords;

export type GlobalPresenceProps = {
  overline: string;
  title: string;
  subtitle: string;
};

export default function GlobalPresence({
  overline,
  title,
  subtitle,
}: GlobalPresenceProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);

  return (
    <section
      ref={ref}
      data-bg="light"
      className="relative py-20 md:py-28 lg:py-32 overflow-hidden"
      style={{ backgroundColor: "#fafbfc" }}
      aria-labelledby="global-presence-title"
    >
      <div
        className="mx-auto px-6 md:px-10 lg:px-12"
        style={{ maxWidth: "1360px" }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          {/* 좌측: 텍스트 블록 */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : undefined}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3 font-heading font-medium uppercase mb-6 text-[rgb(var(--color-primary))]"
              style={{ fontSize: "13px", letterSpacing: "0.2em" }}
            >
              <span
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
              id="global-presence-title"
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-heading font-semibold mb-5"
              style={{
                fontSize: "clamp(2rem, 4vw, 3rem)",
                color: "rgb(var(--color-ink))",
                letterSpacing: "-0.02em",
                lineHeight: 1.08,
              }}
            >
              {title}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="font-body mb-10"
              style={{
                fontSize: "clamp(0.9375rem, 1.1vw, 1.0625rem)",
                lineHeight: 1.65,
                color: "rgba(11,31,58,0.60)",
                maxWidth: "380px",
              }}
            >
              {subtitle}
            </motion.p>

            {/* 국가 리스트 */}
            <motion.ul
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-3"
            >
              {PINS.map((pin) => (
                <li
                  key={pin.id}
                  className="flex items-center gap-3 cursor-default"
                  onMouseEnter={() => setHoveredPin(pin.id)}
                  onMouseLeave={() => setHoveredPin(null)}
                >
                  <span
                    className="inline-block h-2 w-2 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor:
                        hoveredPin === pin.id || pin.isHQ
                          ? "rgb(var(--color-primary))"
                          : "rgba(11,31,58,0.25)",
                      transition: "background-color 0.3s",
                    }}
                  />
                  <span
                    className="font-heading font-medium"
                    style={{
                      fontSize: "14px",
                      color:
                        hoveredPin === pin.id
                          ? "rgb(var(--color-ink))"
                          : "rgba(11,31,58,0.65)",
                      transition: "color 0.3s",
                    }}
                  >
                    {pin.name}
                    {pin.isHQ && (
                      <span
                        className="ml-2 font-normal text-[rgb(var(--color-primary))]"
                        style={{ fontSize: "11px", letterSpacing: "0.15em" }}
                      >
                        HQ
                      </span>
                    )}
                  </span>
                  <span
                    className="font-body"
                    style={{
                      fontSize: "12px",
                      color: "rgba(11,31,58,0.40)",
                    }}
                  >
                    {pin.label}
                  </span>
                </li>
              ))}
            </motion.ul>
          </div>

          {/* 우측: SVG 지도 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : undefined}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-8 relative"
          >
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{
                center: [35, 38],
                scale: 420,
              }}
              width={800}
              height={520}
              style={{ width: "100%", height: "auto" }}
            >
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="rgba(11,31,58,0.06)"
                      stroke="rgba(11,31,58,0.12)"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover: { outline: "none", fill: "rgba(11,31,58,0.10)" },
                        pressed: { outline: "none" },
                      }}
                    />
                  ))
                }
              </Geographies>

              {/* HQ까지 선로 연결 (호버) */}
              {hoveredPin &&
                hoveredPin !== "poland" &&
                (() => {
                  const pin = PINS.find((p) => p.id === hoveredPin);
                  if (!pin) return null;
                  return (
                    <Line
                      from={pin.coords}
                      to={HQ_COORDS}
                      stroke="rgb(246,163,23)"
                      strokeWidth={1.5}
                      strokeDasharray="4 3"
                      strokeLinecap="round"
                      style={{ opacity: 0.6 }}
                    />
                  );
                })()}

              {/* 핀 */}
              {PINS.map((pin) => {
                const isActive = hoveredPin === pin.id;
                const dotSize = pin.isHQ ? 6 : 4;
                return (
                  <Marker
                    key={pin.id}
                    coordinates={pin.coords}
                    onMouseEnter={() => setHoveredPin(pin.id)}
                    onMouseLeave={() => setHoveredPin(null)}
                    style={{ cursor: "default" }}
                  >
                    {/* pulse ring */}
                    {(pin.isHQ || isActive) && (
                      <circle
                        r={dotSize + 6}
                        fill="none"
                        stroke="rgb(246,163,23)"
                        strokeWidth={1}
                        opacity={0.4}
                      >
                        <animate
                          attributeName="r"
                          from={dotSize + 2}
                          to={dotSize + 10}
                          dur="2s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          from="0.5"
                          to="0"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}
                    {/* 점 */}
                    <circle
                      r={isActive ? dotSize + 1 : dotSize}
                      fill={
                        pin.isHQ || isActive
                          ? "rgb(246,163,23)"
                          : "rgba(11,31,58,0.35)"
                      }
                      stroke={isActive ? "rgba(255,255,255,0.8)" : "none"}
                      strokeWidth={isActive ? 1.5 : 0}
                      style={{ transition: "all 0.3s" }}
                    />
                    {/* 라벨 (호버 or HQ) */}
                    {(pin.isHQ || isActive) && (
                      <g>
                        <text
                          textAnchor="middle"
                          y={-dotSize - 10}
                          style={{
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontSize: pin.isHQ ? "11px" : "10px",
                            fontWeight: 500,
                            fill: pin.isHQ
                              ? "rgb(246,163,23)"
                              : "rgb(11,31,58)",
                            letterSpacing: "0.12em",
                          }}
                        >
                          {pin.name.toUpperCase()}
                        </text>
                      </g>
                    )}
                  </Marker>
                );
              })}
            </ComposableMap>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
