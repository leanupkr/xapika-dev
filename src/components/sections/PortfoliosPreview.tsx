"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

type Size = "featured" | "standard";
type BadgeTone = "primary" | "neutral";
type Metric = { value: string; label: string };

type PortfolioItem = {
  key: "ukraine" | "poland" | "uzbekistan";
  number: string;
  country: string;
  project: string;
  since: string;
  badge?: { text: string; tone: BadgeTone };
  metrics: Metric[];
  cta: string;
  href: string;
  /** Hero photo URL. Omit (or pass empty string) to render a placeholder
      background instead — used for projects without a usable photo yet. */
  photo?: string;
  alt: string;
  objectPosition: string;
  size: Size;
};

export type PortfoliosPreviewProps = {
  overline: string;
  title: string;
  subtitle: string;
  viewAll: string;
  items: {
    ukraine: {
      number: string;
      country: string;
      project: string;
      since: string;
      badge: string;
      m1_value: string;
      m1_label: string;
      m2_value: string;
      m2_label: string;
      m3_value: string;
      m3_label: string;
      cta: string;
    };
    poland: {
      number: string;
      country: string;
      project: string;
      since: string;
      m1_value: string;
      m1_label: string;
      m2_value: string;
      m2_label: string;
      cta: string;
    };
    uzbekistan: {
      number: string;
      country: string;
      project: string;
      since: string;
      badge: string;
      m1_value: string;
      m1_label: string;
      m2_value: string;
      m2_label: string;
      cta: string;
    };
  };
};

function PortfolioCard({
  item,
  index,
  inView,
}: {
  item: PortfolioItem;
  index: number;
  inView: boolean;
}) {
  const isFeatured = item.size === "featured";

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      whileHover={{ y: -4 }}
      transition={{
        duration: 0.8,
        delay: 0.12 * index,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`relative ${isFeatured ? "sm:col-span-2 min-h-[280px] md:min-h-[460px] lg:min-h-[520px]" : "min-h-[200px] md:min-h-[360px] lg:min-h-[400px]"}`}
    >
      <Link
        href={item.href}
        aria-label={`${item.country} — ${item.project}`}
        className="group relative block h-full w-full overflow-hidden"
      >
        {/* 사진 — photo가 비어있으면 placeholder 배경만 렌더 */}
        {item.photo ? (
          <Image
            src={item.photo}
            alt={item.alt}
            fill
            sizes={
              isFeatured
                ? "(min-width: 768px) 100vw, 100vw"
                : "(min-width: 768px) 50vw, 100vw"
            }
            className="object-cover transition-transform duration-[6000ms] ease-out group-hover:scale-[1.04]"
            style={{
              filter: "brightness(0.62) contrast(1.10) saturate(0.82)",
              objectPosition: item.objectPosition,
            }}
          />
        ) : (
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 30% 20%, rgba(246,163,23,0.10) 0%, transparent 55%), linear-gradient(160deg, #0e2547 0%, #0b1f3a 60%, #081729 100%)",
            }}
          >
            {/* subtle grid pattern */}
            <svg
              aria-hidden="true"
              className="absolute inset-0 w-full h-full opacity-[0.08]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern id="port-grid" width="32" height="32" patternUnits="userSpaceOnUse">
                  <path d="M32 0 L0 0 0 32" fill="none" stroke="white" strokeWidth="0.6" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#port-grid)" />
            </svg>
          </div>
        )}

        {/* 좌→우 어둠 그라디언트 (Featured는 좌측 콘텐츠 보호 위해 더 진함) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-85"
          style={{
            background: isFeatured
              ? "linear-gradient(100deg, rgba(11,31,58,0.85) 0%, rgba(11,31,58,0.50) 45%, rgba(11,31,58,0.25) 75%, rgba(11,31,58,0.55) 100%)"
              : item.photo
                ? "linear-gradient(180deg, rgba(11,31,58,0.35) 0%, rgba(11,31,58,0.70) 55%, rgba(11,31,58,0.95) 100%)"
                : "linear-gradient(180deg, rgba(11,31,58,0.10) 0%, rgba(11,31,58,0.55) 60%, rgba(11,31,58,0.92) 100%)",
          }}
        />

        {/* 좌상단 헤더: 번호 · 국가 + 뱃지 */}
        <div
          className={`absolute ${isFeatured ? "top-7 left-7 md:top-10 md:left-10" : "top-6 left-6 md:top-7 md:left-7"} flex items-center gap-3 flex-wrap`}
        >
          <span
            className="font-heading font-medium text-[rgb(var(--color-primary))]"
            style={{
              fontSize: isFeatured ? "13px" : "12px",
              letterSpacing: "0.22em",
              textShadow: "0 1px 2px rgba(0,0,0,0.35)",
            }}
          >
            {item.number}
            <span className="text-white/55 mx-2">·</span>
            <span className="text-white/85 uppercase">{item.country}</span>
          </span>

          {item.badge && (
            <span
              className="inline-flex items-center gap-1.5 font-heading font-medium uppercase"
              style={{
                fontSize: "10.5px",
                letterSpacing: "0.18em",
                padding: "5px 10px",
                borderRadius: "2px",
                backgroundColor:
                  item.badge.tone === "primary"
                    ? "rgba(246,163,23,0.16)"
                    : "rgba(255,255,255,0.10)",
                border:
                  item.badge.tone === "primary"
                    ? "1px solid rgba(246,163,23,0.50)"
                    : "1px solid rgba(255,255,255,0.25)",
                color:
                  item.badge.tone === "primary"
                    ? "rgb(var(--color-primary))"
                    : "rgba(255,255,255,0.80)",
              }}
            >
              {item.badge.tone === "primary" && (
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: "rgb(var(--color-primary))" }}
                />
              )}
              {item.badge.text}
            </span>
          )}
        </div>

        {/* 좌하단 콘텐츠 */}
        <div
          className={`absolute left-0 right-0 bottom-0 ${isFeatured ? "p-7 md:p-10 lg:p-12 md:max-w-[60%]" : "p-6 md:p-8 lg:p-10"}`}
        >
          {/* Since */}
          <div
            className="font-heading uppercase text-white/55 mb-3"
            style={{
              fontSize: "11px",
              letterSpacing: "0.22em",
            }}
          >
            {item.since}
          </div>

          {/* 프로젝트명 */}
          <h3
            className="font-heading font-semibold text-white mb-5 md:mb-6"
            style={{
              fontSize: isFeatured
                ? "clamp(1.75rem, 3vw, 2.5rem)"
                : "clamp(1.25rem, 1.9vw, 1.625rem)",
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
              maxWidth: isFeatured ? "22ch" : "22ch",
              wordBreak: "break-word",
              overflowWrap: "break-word",
            }}
          >
            {item.project}
          </h3>

          {/* 메트릭: 모바일 세로 stack / 데스크톱 가로 divider */}
          <div className="flex flex-col md:flex-row md:items-center md:flex-wrap gap-3 md:gap-y-3 md:gap-x-0 mb-6">
            {item.metrics.map((m, i) => (
              <div
                key={`${item.key}-m-${i}`}
                className={
                  i > 0
                    ? "md:border-l md:border-white/15 md:pl-4 lg:pl-5 md:ml-4 lg:ml-5"
                    : ""
                }
              >
                <div
                  className="font-heading font-semibold text-white"
                  style={{
                    fontSize: isFeatured
                      ? "clamp(1.25rem, 1.8vw, 1.5rem)"
                      : "clamp(1rem, 1.3vw, 1.125rem)",
                    letterSpacing: "-0.01em",
                    fontVariantNumeric: "tabular-nums",
                    lineHeight: 1.1,
                  }}
                >
                  {m.value}
                </div>
                <div
                  className="font-heading uppercase text-white/55 mt-1"
                  style={{
                    fontSize: "10.5px",
                    letterSpacing: "0.15em",
                  }}
                >
                  {m.label}
                </div>
              </div>
            ))}
          </div>

          {/* CTA — 카드별 고유 카피 */}
          <span
            className="inline-flex items-center gap-2 font-heading font-medium text-white/85 group-hover:text-[rgb(var(--color-primary))] transition-colors duration-300"
            style={{
              fontSize: isFeatured ? "14px" : "13px",
              letterSpacing: "0.02em",
            }}
          >
            {item.cta}
            <ArrowRight
              size={isFeatured ? 16 : 14}
              strokeWidth={2}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

export default function PortfoliosPreview({
  overline,
  title,
  subtitle,
  viewAll,
  items,
}: PortfoliosPreviewProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  // TODO: 서비스별 실사 확보 시 photo 경로 교체
  const portfolios: PortfolioItem[] = [
    {
      key: "ukraine",
      number: items.ukraine.number,
      country: items.ukraine.country,
      project: items.ukraine.project,
      since: items.ukraine.since,
      badge: { text: items.ukraine.badge, tone: "primary" },
      metrics: [
        { value: items.ukraine.m1_value, label: items.ukraine.m1_label },
        { value: items.ukraine.m2_value, label: items.ukraine.m2_label },
        { value: items.ukraine.m3_value, label: items.ukraine.m3_label },
      ],
      cta: items.ukraine.cta,
      href: "/portfolios/ukraine-emu",
      photo: "/portfolios/ukraine-emu/hero-main.jpg",
      alt: "HRCS2 maintenance work for Ukrzaliznytsia",
      objectPosition: "center 40%",
      size: "featured",
    },
    {
      key: "poland",
      number: items.poland.number,
      country: items.poland.country,
      project: items.poland.project,
      since: items.poland.since,
      metrics: [
        { value: items.poland.m1_value, label: items.poland.m1_label },
        { value: items.poland.m2_value, label: items.poland.m2_label },
      ],
      cta: items.poland.cta,
      href: "/portfolios/warsaw-tram",
      photo: "/portfolios/warsaw-tram/hero-main.jpg",
      alt: "Warsaw tram maintenance program",
      objectPosition: "center 55%",
      size: "standard",
    },
    {
      key: "uzbekistan",
      number: items.uzbekistan.number,
      country: items.uzbekistan.country,
      project: items.uzbekistan.project,
      since: items.uzbekistan.since,
      badge: { text: items.uzbekistan.badge, tone: "neutral" },
      metrics: [
        { value: items.uzbekistan.m1_value, label: items.uzbekistan.m1_label },
        { value: items.uzbekistan.m2_value, label: items.uzbekistan.m2_label },
      ],
      cta: items.uzbekistan.cta,
      href: "/portfolios/uzbekistan-rail",
      photo: "",
      alt: "High-speed rail maintenance hub preparation — Tashkent",
      objectPosition: "70% 50%",
      size: "standard",
    },
  ];

  return (
    <section
      ref={ref}
      data-bg="light"
      className="relative py-14 md:py-20 lg:py-24"
      style={{ backgroundColor: "#fafbfc" }}
      aria-labelledby="portfolios-title"
    >
      <div
        className="mx-auto px-6 md:px-10 lg:px-12"
        style={{ maxWidth: "1360px" }}
      >
        {/* 헤더 — 2단 레이아웃: 좌측 타이틀 / 우측 subtitle */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-14 md:mb-20">
          <div className="max-w-2xl">
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
              id="portfolios-title"
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-heading font-semibold"
              style={{
                fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
                color: "rgb(var(--color-ink))",
                letterSpacing: "-0.02em",
                lineHeight: 1.08,
              }}
            >
              {title}
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-body"
            style={{
              fontSize: "clamp(0.9375rem, 1.1vw, 1.0625rem)",
              lineHeight: 1.65,
              color: "rgba(11,31,58,0.62)",
              maxWidth: "420px",
            }}
          >
            {subtitle}
          </motion.p>
        </div>

        {/* 카드 그리드: Featured(풀폭) + Standard(2개, 반반) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-5">
          {portfolios.map((item, i) => (
            <PortfolioCard key={item.key} item={item} index={i} inView={inView} />
          ))}
        </div>

        {/* View all — Ghost 링크 */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 md:mt-16 flex justify-center"
        >
          <Link
            href="/portfolios"
            className="group inline-flex items-center gap-2 font-heading font-medium"
            style={{
              fontSize: "14px",
              color: "rgb(var(--color-ink))",
              padding: "14px 24px",
              border: "1px solid rgba(11,31,58,0.14)",
              borderRadius: "2px",
              backgroundColor: "rgba(255,255,255,0.5)",
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.borderColor = "rgb(var(--color-primary))";
              el.style.color = "rgb(var(--color-primary))";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.borderColor = "rgba(11,31,58,0.14)";
              el.style.color = "rgb(var(--color-ink))";
            }}
          >
            {viewAll}
            <ArrowUpRight
              size={16}
              strokeWidth={2}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
