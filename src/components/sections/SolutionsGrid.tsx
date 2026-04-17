"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Size = "featured" | "secondary" | "tertiary";

type SolutionItem = {
  key: "light" | "heavy" | "supply" | "digital" | "commercial";
  number: string;
  title: string;
  description: string;
  metric: string;
  cta: string;
  href: string;
  photo: string;
  alt: string;
  size: Size;
  objectPosition: string;
};

type SolutionsGridProps = {
  overline: string;
  title: string;
  subtitle: string;
  items: {
    light: { title: string; description: string; metric: string };
    heavy: { title: string; description: string; metric: string };
    supply: { title: string; description: string; metric: string };
    digital: { title: string; description: string; metric: string };
    commercial: { title: string; description: string; metric: string };
  };
};

const SIZE_TO_CLASSES: Record<Size, { grid: string; minH: string; titleSize: string }> = {
  featured: {
    grid: "col-span-2 lg:col-span-8",
    minH: "min-h-[240px] md:min-h-[420px] lg:min-h-[480px]",
    titleSize: "clamp(1.75rem, 2.8vw, 2.25rem)",
  },
  secondary: {
    grid: "lg:col-span-4",
    minH: "min-h-[180px] md:min-h-[340px] lg:min-h-[480px]",
    titleSize: "clamp(1.25rem, 1.7vw, 1.5rem)",
  },
  tertiary: {
    grid: "lg:col-span-4",
    minH: "min-h-[150px] md:min-h-[280px] lg:min-h-[320px]",
    titleSize: "clamp(1.25rem, 1.7vw, 1.5rem)",
  },
};

function SolutionCard({
  item,
  index,
  inView,
}: {
  item: SolutionItem;
  index: number;
  inView: boolean;
}) {
  const sizeClasses = SIZE_TO_CLASSES[item.size];
  const isFeatured = item.size === "featured";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{
        duration: 0.8,
        delay: 0.08 * index,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`${sizeClasses.grid} ${sizeClasses.minH} relative`}
    >
      <Link
        href={item.href}
        aria-label={`${item.title} — ${item.description}`}
        className="group relative block h-full w-full overflow-hidden"
      >
        {/* 사진 */}
        <div className="absolute inset-0">
          <Image
            src={item.photo}
            alt={item.alt}
            fill
            sizes={
              isFeatured
                ? "(min-width: 1024px) 66vw, 100vw"
                : "(min-width: 1024px) 33vw, 100vw"
            }
            className="object-cover transition-transform duration-[6000ms] ease-out group-hover:scale-[1.04]"
            style={{
              filter: "brightness(0.72) contrast(1.08) saturate(0.82)",
              objectPosition: item.objectPosition,
            }}
          />
        </div>

        {/* 오버레이 그라데이션 */}
        <div
          aria-hidden="true"
          className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-80"
          style={{
            background: isFeatured
              ? "linear-gradient(170deg, rgba(11,31,58,0.10) 0%, rgba(11,31,58,0.35) 40%, rgba(11,31,58,0.92) 100%)"
              : "linear-gradient(180deg, rgba(11,31,58,0.25) 0%, rgba(11,31,58,0.55) 55%, rgba(11,31,58,0.95) 100%)",
          }}
        />

        {/* Featured 전용 — MMIS 대시보드 느낌 추상 SVG */}
        {isFeatured && (
          <svg
            aria-hidden="true"
            className="hidden sm:block absolute top-6 right-6 md:top-8 md:right-8 w-[200px] md:w-[280px] h-[90px] md:h-[112px] opacity-70"
            viewBox="0 0 280 112"
            fill="none"
          >
            {/* 그리드 라인 */}
            <line x1="0" y1="28" x2="280" y2="28" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="2 4" />
            <line x1="0" y1="56" x2="280" y2="56" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="2 4" />
            <line x1="0" y1="84" x2="280" y2="84" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="2 4" />
            {/* 백그라운드 라인 (낮은 주황) */}
            <path
              d="M0 90 L40 82 L80 85 L120 74 L160 78 L200 66 L240 70 L280 58"
              stroke="rgba(246,163,23,0.25)"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* 메인 라인 (Work orders trend) */}
            <path
              d="M0 76 L40 60 L80 66 L120 44 L160 52 L200 30 L240 36 L280 18"
              stroke="rgb(246,163,23)"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* 데이터 포인트 */}
            <circle cx="80" cy="66" r="2.5" fill="rgb(246,163,23)" />
            <circle cx="160" cy="52" r="2.5" fill="rgb(246,163,23)" />
            <circle cx="240" cy="36" r="2.5" fill="rgb(246,163,23)" />
            <circle cx="280" cy="18" r="3" fill="#fff" stroke="rgb(246,163,23)" strokeWidth="1.5" />
            {/* 라벨 */}
            <text x="0" y="108" fill="rgba(255,255,255,0.45)" fontSize="8" fontFamily="monospace" letterSpacing="0.15em">
              WORK ORDERS · 30D
            </text>
          </svg>
        )}

        {/* 번호 (좌상단) */}
        <span
          className="absolute top-6 left-6 md:top-7 md:left-7 font-heading font-medium text-[rgb(var(--color-primary))]"
          style={{
            fontSize: isFeatured ? "14px" : "12px",
            letterSpacing: "0.22em",
            fontVariantNumeric: "tabular-nums",
            textShadow: "0 1px 2px rgba(0,0,0,0.35)",
          }}
        >
          {item.number}
        </span>

        {/* 콘텐츠 — 하단 정렬 */}
        <div
          className="absolute inset-x-0 bottom-0 p-6 md:p-8 lg:p-10"
          style={{ paddingRight: isFeatured ? undefined : undefined }}
        >
          <h3
            className="font-heading font-semibold text-white"
            style={{
              fontSize: sizeClasses.titleSize,
              letterSpacing: "-0.018em",
              lineHeight: 1.15,
              maxWidth: isFeatured ? "22ch" : "18ch",
            }}
          >
            {item.title}
          </h3>

          {/* Featured만 설명 + 메트릭 inline 표시 */}
          {isFeatured && (
            <p
              className="font-body text-white/75 mt-4"
              style={{
                fontSize: "clamp(0.9375rem, 1vw, 1rem)",
                lineHeight: 1.6,
                maxWidth: "52ch",
              }}
            >
              {item.description}{" "}
              <span className="text-white/55">— {item.metric}.</span>
            </p>
          )}

          {/* CTA — 카드별 고유 카피 */}
          <span
            className="mt-5 md:mt-6 inline-flex items-center gap-2 font-heading font-medium text-white/85 group-hover:text-[rgb(var(--color-primary))] transition-colors duration-300"
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

export default function SolutionsGrid({
  overline,
  title,
  subtitle,
  items,
}: SolutionsGridProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  // 배치 순서: Featured → Secondary → Tertiary x 3
  // 번호는 자연스러운 목록 순서(01~05)로 유지
  const solutions: SolutionItem[] = [
    {
      key: "digital",
      number: "04 / 05",
      title: items.digital.title,
      description: items.digital.description,
      metric: items.digital.metric,
      cta: "See MMIS platform",
      href: "/solutions/digital-asset-management",
      photo: "/hero/hero-01-wide.jpg",
      alt: "MMIS digital asset management platform — work orders and inventory",
      size: "featured",
      objectPosition: "center 60%",
    },
    {
      key: "light",
      number: "01 / 05",
      title: items.light.title,
      description: items.light.description,
      metric: items.light.metric,
      cta: "Methodology",
      href: "/solutions/light-maintenance",
      photo: "/hero/hero-02-work.jpg",
      alt: "Light maintenance inspection at depot",
      size: "secondary",
      objectPosition: "30% 50%",
    },
    {
      key: "heavy",
      number: "02 / 05",
      title: items.heavy.title,
      description: items.heavy.description,
      metric: items.heavy.metric,
      cta: "Case studies",
      href: "/solutions/heavy-maintenance",
      photo: "/hero/hero-03-detail.jpg",
      alt: "Heavy maintenance overhaul — component detail",
      size: "tertiary",
      objectPosition: "center 35%",
    },
    {
      key: "supply",
      number: "03 / 05",
      title: items.supply.title,
      description: items.supply.description,
      metric: items.supply.metric,
      cta: "Partner network",
      href: "/solutions/supply-chain",
      photo: "/hero/hero-05-detail.jpg",
      alt: "Rolling stock supply chain — parts and inventory",
      size: "tertiary",
      objectPosition: "20% 60%",
    },
    {
      key: "commercial",
      number: "05 / 05",
      title: items.commercial.title,
      description: items.commercial.description,
      metric: items.commercial.metric,
      cta: "Revenue programs",
      href: "/solutions/commercial-services",
      photo: "/hero/hero-04-work.jpg",
      alt: "Station concessions and commercial services",
      size: "tertiary",
      objectPosition: "75% 50%",
    },
  ];

  return (
    <section
      ref={ref}
      data-bg="dark"
      className="relative py-14 md:py-20 lg:py-24"
      style={{ backgroundColor: "rgb(var(--color-ink))" }}
      aria-labelledby="solutions-title"
    >
      {/* 상단 hairline */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.06)" }}
      />

      <div
        className="mx-auto px-6 md:px-10 lg:px-12"
        style={{ maxWidth: "1360px" }}
      >
        {/* 헤더 */}
        <div className="max-w-3xl mb-14 md:mb-20">
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
            id="solutions-title"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading font-semibold text-white"
            style={{
              fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
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
            className="font-body text-white/60 mt-6"
            style={{
              fontSize: "clamp(1rem, 1.4vw, 1.125rem)",
              lineHeight: 1.65,
              maxWidth: "580px",
            }}
          >
            {subtitle}
          </motion.p>
        </div>

        {/* 카드 편집 레이아웃: 12-col grid
            Row 1: Featured (8) + Secondary (4)
            Row 2: Tertiary (4) × 3 */}
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-3 md:gap-5">
          {solutions.map((item, i) => (
            <SolutionCard key={item.key} item={item} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
