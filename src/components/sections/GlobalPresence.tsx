"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import dynamic from "next/dynamic";
import { useMediaQuery } from "@/lib/useMediaQuery";

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

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

type Pin = {
  id: string;
  name: string;
  label: string;
  coords: [number, number]; // [longitude, latitude]
  countryId: string;
  isHQ?: boolean;
};

const PINS: Pin[] = [
  { id: "poland",     name: "Poland",      label: "HQ · Warsaw", coords: [21.0118, 52.2297], countryId: "616", isHQ: true },
  { id: "ukraine",    name: "Ukraine",     label: "Kyiv",        coords: [30.52, 50.45],     countryId: "804" },
  { id: "turkey",     name: "Türkiye",     label: "Istanbul",    coords: [28.98, 41.01],     countryId: "792" },
  { id: "uzbekistan", name: "Uzbekistan",  label: "Tashkent",    coords: [69.28, 41.30],     countryId: "860" },
  { id: "korea",      name: "South Korea", label: "Seoul",       coords: [126.98, 37.57],    countryId: "410" },
  { id: "egypt",      name: "Egypt",       label: "Cairo",       coords: [31.24, 30.04],     countryId: "818" },
  { id: "usa",        name: "USA",         label: "Virginia",    coords: [-77.43, 37.54],    countryId: "840" },
  { id: "brazil",     name: "Brazil",      label: "São Paulo",   coords: [-46.63, -23.55],   countryId: "076" },
];

const HQ = PINS.find((p) => p.isHQ)!;
const SPOKES = PINS.filter((p) => !p.isHQ);
const PIN_BY_COUNTRY = Object.fromEntries(PINS.map((p) => [p.countryId, p])) as Record<string, Pin | undefined>;
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const CYCLE_INTERVAL_MS = 3500;
const SPOTLIGHT_HOLD_MS = 2800; // 나머지 700ms는 rest

export type GlobalPresenceProps = {
  overline: string;
  title: string;
  subtitle: string;
  stat1Value: string;
  stat1Unit: string;
  stat2Value: string;
  stat2Unit: string;
  stat3Value: string;
  stat3Unit: string;
};

export default function GlobalPresence({
  overline,
  title,
  subtitle,
  stat1Value,
  stat1Unit,
  stat2Value,
  stat2Unit,
  stat3Value,
  stat3Unit,
}: GlobalPresenceProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.15 });

  // 한 번만 play하는 entry 애니메이션용
  const [hasEntered, setHasEntered] = useState(false);

  // 클라이언트 마운트 후에만 지도 렌더 (SSR과 client의 부동소수점 차이로 인한 path d-attr hydration mismatch 방지)
  const [mounted, setMounted] = useState(false);
  const isMobile = useMediaQuery("(max-width: 1023px)");
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  useEffect(() => {
    setMounted(true);
  }, []);

  // hover(수동) vs auto-spotlight(자동) 두 출처를 분리
  const [userHovered, setUserHovered] = useState<string | null>(null);
  const [autoSpot, setAutoSpot] = useState<string | null>(null);
  const activePin = userHovered ?? autoSpot;
  const isHovering = activePin !== null;

  const pausedRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const restRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idxRef = useRef(0);

  // entry 애니메이션 한 번만
  useEffect(() => {
    if (inView && !hasEntered) setHasEntered(true);
  }, [inView, hasEntered]);

  // 자동 순환 (hybrid spotlight)
  useEffect(() => {
    if (!inView || typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    intervalRef.current = setInterval(() => {
      if (pausedRef.current) return;
      const next = SPOKES[idxRef.current];
      setAutoSpot(next.id);
      idxRef.current = (idxRef.current + 1) % SPOKES.length;

      if (restRef.current) clearTimeout(restRef.current);
      restRef.current = setTimeout(() => setAutoSpot(null), SPOTLIGHT_HOLD_MS);
    }, CYCLE_INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (restRef.current) clearTimeout(restRef.current);
      setAutoSpot(null);
    };
  }, [inView]);

  const handleEnter = (id: string) => {
    pausedRef.current = true;
    setUserHovered(id);
  };
  const handleLeave = () => {
    pausedRef.current = false;
    setUserHovered(null);
  };

  return (
    <section
      ref={ref}
      data-bg="light"
      className="relative py-10 md:py-20 lg:py-24 overflow-hidden"
      style={{ backgroundColor: "#fafbfc" }}
      aria-labelledby="global-presence-title"
    >
      {/* 배경 데코 */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: "80%",
          height: "60%",
          background:
            "radial-gradient(ellipse at center, rgba(246,163,23,0.06) 0%, rgba(246,163,23,0) 60%)",
        }}
      />

      {/* 스크린리더용 라이브 영역 */}
      <p className="sr-only" aria-live="polite">
        {activePin
          ? `Active hub: ${PINS.find((p) => p.id === activePin)?.name ?? ""}`
          : ""}
      </p>

      <div
        className="relative mx-auto px-6 md:px-10 lg:px-12"
        style={{ maxWidth: "1360px" }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          {/* 좌측: 텍스트 블록 */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={hasEntered ? { opacity: 1, x: 0 } : undefined}
              transition={{ duration: 0.5, ease: EASE }}
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
              animate={hasEntered ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
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
              animate={hasEntered ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
              className="font-body mb-8"
              style={{
                fontSize: "clamp(0.9375rem, 1.1vw, 1.0625rem)",
                lineHeight: 1.65,
                color: "rgba(11,31,58,0.60)",
                maxWidth: "380px",
              }}
            >
              {subtitle}
            </motion.p>

            {/* 통계 바 */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={hasEntered ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
              className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 pb-6"
              style={{ borderBottom: "1px solid rgba(11,31,58,0.08)" }}
            >
              <StatCell value={stat1Value} unit={stat1Unit} />
              <StatCell value={stat2Value} unit={stat2Unit} />
              <StatCell value={stat3Value} unit={stat3Unit} />
            </motion.div>

            {/* 국가 리스트 — 모바일 2열, 데스크톱 1열 */}
            <motion.ul
              initial={{ opacity: 0, y: 12 }}
              animate={hasEntered ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
              className="grid grid-cols-2 lg:grid-cols-1 gap-x-2 gap-y-1"
            >
              {PINS.map((pin) => {
                const isActive = activePin === pin.id;
                return (
                  <li
                    key={pin.id}
                    className="relative flex items-center gap-3 cursor-default py-2 px-3 -mx-3 rounded-md"
                    style={{
                      backgroundColor: isActive
                        ? "rgba(246,163,23,0.08)"
                        : "transparent",
                      transition: "background-color 0.25s",
                    }}
                    onMouseEnter={() => handleEnter(pin.id)}
                    onMouseLeave={handleLeave}
                    onClick={() => handleEnter(pin.id)}
                  >
                    <span
                      aria-hidden
                      className="absolute left-0 top-2 bottom-2 rounded-full"
                      style={{
                        width: "2px",
                        backgroundColor: "rgb(var(--color-primary))",
                        opacity: isActive ? 1 : 0,
                        transition: "opacity 0.25s",
                      }}
                    />
                    <span
                      className="inline-block h-1.5 w-1.5 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor: "rgb(var(--color-primary))",
                        boxShadow: isActive
                          ? "0 0 0 3px rgba(246,163,23,0.25)"
                          : "0 0 0 0 rgba(246,163,23,0)",
                        transition: "box-shadow 0.25s",
                      }}
                    />
                    <span
                      className="font-heading font-medium flex-1"
                      style={{
                        fontSize: "14px",
                        color: isActive
                          ? "rgb(var(--color-ink))"
                          : "rgba(11,31,58,0.72)",
                        transition: "color 0.25s",
                      }}
                    >
                      {pin.name}
                      {pin.isHQ && (
                        <span
                          className="ml-2 font-normal text-[rgb(var(--color-primary))] align-middle"
                          style={{
                            fontSize: "10px",
                            letterSpacing: "0.18em",
                            padding: "2px 6px",
                            border: "1px solid rgba(246,163,23,0.35)",
                            borderRadius: "3px",
                          }}
                        >
                          HQ
                        </span>
                      )}
                    </span>
                    <span
                      className="font-body"
                      style={{
                        fontSize: "12px",
                        color: isActive
                          ? "rgba(11,31,58,0.70)"
                          : "rgba(11,31,58,0.40)",
                        letterSpacing: "0.02em",
                        transition: "color 0.25s",
                      }}
                    >
                      {pin.label.replace(/^HQ · /, "")}
                    </span>
                  </li>
                );
              })}
            </motion.ul>
          </div>

          {/* 우측: SVG 지도 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={hasEntered ? { opacity: 1 } : undefined}
            transition={{ duration: 1, delay: 0.3, ease: EASE }}
            className="lg:col-span-8 relative"
          >
            <div
              className="absolute top-0 right-0 flex items-center gap-2 pointer-events-none"
              style={{
                fontSize: "11px",
                fontFamily: "'Space Grotesk', sans-serif",
                letterSpacing: "0.2em",
                color: "rgba(11,31,58,0.45)",
                textTransform: "uppercase",
              }}
            >
              <span
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: "rgb(246,163,23)",
                  boxShadow: "0 0 0 3px rgba(246,163,23,0.2)",
                  animation: "livepulse 1.8s ease-in-out infinite",
                }}
              />
              8 Hubs · Live
            </div>

            {!mounted && (
              <div
                aria-hidden
                style={{
                  width: "100%",
                  aspectRatio: `${isMobile ? 500 : 800} / ${isMobile ? 420 : 600}`,
                }}
              />
            )}
            {mounted && (
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{
                // Center near the centroid of all 8 hubs so the Americas
                // (Virginia, São Paulo) sit fully inside the canvas alongside
                // the Europe/Asia/Africa hubs.
                center: isMobile ? [25, 30] : [25, 28],
                scale: isMobile ? 110 : 145,
              }}
              width={isMobile ? 500 : 800}
              height={isMobile ? 420 : 600}
              style={{ width: "100%", height: "auto" }}
            >
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const pin = PIN_BY_COUNTRY[String(geo.id)];
                    const isActiveCountry = pin && activePin === pin.id;
                    const isAnchor = !!pin;
                    const baseFill = isActiveCountry
                      ? "rgba(246,163,23,0.22)"
                      : isAnchor
                        ? "rgba(11,31,58,0.11)"
                        : "rgba(11,31,58,0.055)";
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={baseFill}
                        stroke="rgba(11,31,58,0.15)"
                        strokeWidth={isActiveCountry ? 0.9 : 0.4}
                        onMouseEnter={() => {
                          if (pin) handleEnter(pin.id);
                        }}
                        onMouseLeave={() => {
                          if (pin) handleLeave();
                        }}
                        onClick={() => {
                          if (pin) handleEnter(pin.id);
                        }}
                        style={{
                          default: {
                            outline: "none",
                            transition: "fill 0.25s, stroke-width 0.25s",
                            cursor: isAnchor ? "pointer" : "default",
                          },
                          hover: {
                            outline: "none",
                            fill: isAnchor
                              ? "rgba(246,163,23,0.22)"
                              : "rgba(11,31,58,0.09)",
                          },
                          pressed: { outline: "none" },
                        }}
                      />
                    );
                  })
                }
              </Geographies>

              {/* 상시 허브-스포크 연결선 */}
              {SPOKES.map((pin, i) => {
                const isActive = activePin === pin.id;
                const isDimmed = isHovering && !isActive;
                const lineOpacity = isActive ? 1 : isDimmed ? 0.08 : 0.28;
                const lineDelay = 0.5 + i * 0.15;
                return (
                  <motion.g
                    key={`line-${pin.id}`}
                    initial={{ opacity: 0 }}
                    animate={hasEntered ? { opacity: 1 } : undefined}
                    transition={{ delay: lineDelay, duration: 0.6, ease: EASE }}
                    style={{ pointerEvents: "none" }}
                  >
                    {isActive && (
                      <Line
                        from={pin.coords}
                        to={HQ.coords}
                        stroke="rgb(246,163,23)"
                        strokeWidth={4}
                        strokeLinecap="round"
                        style={{ opacity: 0.18 }}
                      />
                    )}
                    <Line
                      from={pin.coords}
                      to={HQ.coords}
                      stroke="rgb(246,163,23)"
                      strokeWidth={isActive ? 1.8 : 1.1}
                      strokeDasharray="4 3"
                      strokeLinecap="round"
                      style={{
                        opacity: lineOpacity,
                        animation: `dashflow ${isActive ? 0.8 : 1.6}s linear infinite`,
                        transition:
                          "opacity 0.35s cubic-bezier(0.4,0,0.2,1), stroke-width 0.35s cubic-bezier(0.4,0,0.2,1)",
                      }}
                    />
                  </motion.g>
                );
              })}

              {/* 핀 */}
              {PINS.map((pin) => {
                const isActive = activePin === pin.id;
                const isDimmed = isHovering && !isActive && !pin.isHQ;
                const dotSize = pin.isHQ ? 7 : 4.5;
                const spokeIndex = SPOKES.findIndex((p) => p.id === pin.id);
                const dotDelay = pin.isHQ ? 0.3 : 0.5 + spokeIndex * 0.15 + 0.5;
                const labelDelay = pin.isHQ ? 0.45 : 0.5 + spokeIndex * 0.15 + 0.7;

                return (
                  <Marker
                    key={pin.id}
                    coordinates={pin.coords}
                    onMouseEnter={() => handleEnter(pin.id)}
                    onMouseLeave={handleLeave}
                    style={{ cursor: "pointer" }}
                  >
                    {/* 모바일 터치 히트박스 */}
                    <circle
                      r={dotSize + 16}
                      fill="transparent"
                      stroke="none"
                      onClick={() => handleEnter(pin.id)}
                      style={{ cursor: "pointer" }}
                    />
                    {/* pulse ring — HQ 상시, 비-HQ는 active 시 */}
                    {(pin.isHQ || isActive) && (
                      <circle
                        r={dotSize + 6}
                        fill="none"
                        stroke="rgb(246,163,23)"
                        strokeWidth={1}
                        opacity={0.5}
                      >
                        {!prefersReducedMotion && (
                          <>
                            <animate
                              attributeName="r"
                              from={dotSize + 2}
                              to={dotSize + 14}
                              dur="2s"
                              repeatCount="indefinite"
                            />
                            <animate
                              attributeName="opacity"
                              from="0.6"
                              to="0"
                              dur="2s"
                              repeatCount="indefinite"
                            />
                          </>
                        )}
                      </circle>
                    )}

                    {/* active 시 outer ring (비-HQ) */}
                    {isActive && !pin.isHQ && (
                      <circle
                        r={dotSize + 5}
                        fill="none"
                        stroke="rgb(246,163,23)"
                        strokeWidth={1.2}
                        opacity={0.6}
                      />
                    )}

                    {/* 점 */}
                    <motion.g
                      initial={{ scale: 0 }}
                      animate={hasEntered ? { scale: 1 } : undefined}
                      transition={{ delay: dotDelay, duration: 0.4, ease: EASE }}
                    >
                      <circle
                        r={isActive ? dotSize + 1.5 : dotSize}
                        fill="rgb(246,163,23)"
                        stroke="#ffffff"
                        strokeWidth={pin.isHQ ? 2 : 1.5}
                        opacity={isDimmed ? 0.55 : 1}
                        style={{
                          transition:
                            "r 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.35s cubic-bezier(0.4,0,0.2,1)",
                          filter: isActive
                            ? "drop-shadow(0 2px 6px rgba(246,163,23,0.45))"
                            : "drop-shadow(0 1px 2px rgba(246,163,23,0.25))",
                        }}
                      />
                    </motion.g>

                    {/* 라벨 — 상시 표시, 강조 시 텍스트 크기/굵기 + 흰색 halo */}
                    <motion.g
                      initial={{ opacity: 0 }}
                      animate={hasEntered ? { opacity: 1 } : undefined}
                      transition={{ delay: labelDelay, duration: 0.5, ease: EASE }}
                      style={{ pointerEvents: "none" }}
                    >
                      <text
                        textAnchor="middle"
                        y={-dotSize - 10}
                        style={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontSize: pin.isHQ
                            ? "11px"
                            : isActive
                              ? "11px"
                              : "10px",
                          fontWeight: pin.isHQ ? 700 : isActive ? 700 : 500,
                          fill: pin.isHQ
                            ? "rgb(246,163,23)"
                            : isActive
                              ? "rgb(11,31,58)"
                              : "rgba(11,31,58,0.65)",
                          letterSpacing: "0.14em",
                          opacity: isDimmed ? 0.35 : 1,
                          paintOrder: "stroke",
                          stroke: isActive
                            ? "rgba(250,251,252,0.95)"
                            : "rgba(250,251,252,0.7)",
                          strokeWidth: isActive ? 3.5 : 2.5,
                          strokeLinejoin: "round",
                          transition:
                            "fill 0.35s cubic-bezier(0.4,0,0.2,1), font-size 0.35s cubic-bezier(0.4,0,0.2,1), font-weight 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.35s cubic-bezier(0.4,0,0.2,1), stroke-width 0.35s cubic-bezier(0.4,0,0.2,1)",
                        }}
                      >
                        {pin.name.toUpperCase()}
                      </text>
                    </motion.g>
                  </Marker>
                );
              })}
            </ComposableMap>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function StatCell({ value, unit }: { value: string; unit: string }) {
  return (
    <div>
      <div
        className="font-heading font-semibold"
        style={{
          fontSize: "clamp(1.5rem, 2.2vw, 1.875rem)",
          color: "rgb(var(--color-ink))",
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div
        className="font-heading uppercase mt-1"
        style={{
          fontSize: "10px",
          letterSpacing: "0.18em",
          color: "rgba(11,31,58,0.50)",
        }}
      >
        {unit}
      </div>
    </div>
  );
}
