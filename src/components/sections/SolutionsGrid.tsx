"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";

type Size = "featured" | "secondary" | "tertiary";

export type SolutionMetric = { value: string; label: string };

type SolutionItem = {
  key: "light" | "heavy" | "supply" | "digital" | "commercial";
  number: string;
  title: string;
  description: string;
  metrics: ReadonlyArray<SolutionMetric>;
  cta: string;
  href: string;
  photo: string;
  alt: string;
  size: Size;
  objectPosition: string;
};

type SolutionEntry = {
  title: string;
  description: string;
  metrics: ReadonlyArray<SolutionMetric>;
};

type SolutionsGridProps = {
  overline: string;
  title: string;
  subtitle: string;
  items: {
    light: SolutionEntry;
    heavy: SolutionEntry;
    supply: SolutionEntry;
    digital: SolutionEntry;
    commercial: SolutionEntry;
  };
};

const SIZE_TO_CLASSES: Record<Size, { grid: string; minH: string; titleSize: string }> = {
  featured: {
    // mobile: full-width (col-span-2 of 2-col grid); lg: 8/12 of 12-col grid
    grid: "col-span-2 sm:col-span-2 lg:col-span-8",
    minH: "min-h-[360px] md:min-h-[420px] lg:min-h-[480px]",
    titleSize: "clamp(1.5rem, 2.8vw, 2.25rem)",
  },
  secondary: {
    grid: "lg:col-span-4",
    minH: "min-h-[200px] sm:min-h-[240px] md:min-h-[340px] lg:min-h-[480px]",
    titleSize: "clamp(1.0625rem, 1.7vw, 1.5rem)",
  },
  tertiary: {
    grid: "lg:col-span-4",
    minH: "min-h-[200px] sm:min-h-[220px] md:min-h-[280px] lg:min-h-[320px]",
    titleSize: "clamp(1.0625rem, 1.7vw, 1.5rem)",
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
        className="group relative flex flex-col h-full w-full overflow-hidden"
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

        {/* 번호 (상단) — normal flow so content below pushes naturally */}
        <span
          className={`relative z-10 self-start font-heading font-medium text-[rgb(var(--color-primary))] whitespace-nowrap ${
            isFeatured
              ? "px-6 pt-6 md:px-7 md:pt-7 lg:px-10 lg:pt-10"
              : "px-3.5 pt-3.5 md:px-7 md:pt-7 lg:px-10 lg:pt-10"
          }`}
          style={{
            fontSize: isFeatured ? "14px" : "11px",
            letterSpacing: "0.22em",
            fontVariantNumeric: "tabular-nums",
            textShadow: "0 1px 2px rgba(0,0,0,0.35)",
          }}
        >
          {item.number}
        </span>

        {/* 콘텐츠 — flex mt-auto로 하단 정렬, 콘텐츠가 커지면 카드 자체가 늘어남 */}
        <div
          className={`relative z-10 mt-auto ${
            isFeatured
              ? "p-6 md:p-8 lg:p-10 pt-4 md:pt-6"
              : "p-3.5 md:p-8 lg:p-10 pt-3 md:pt-6"
          }`}
        >
          <h3
            className="font-heading font-semibold text-white"
            style={{
              fontSize: sizeClasses.titleSize,
              letterSpacing: "-0.018em",
              lineHeight: 1.15,
              maxWidth: isFeatured ? "22ch" : "18ch",
              overflowWrap: "break-word",
              wordBreak: "keep-all",
            }}
          >
            {item.title}
          </h3>

          {/* Featured: 설명 풀 텍스트 */}
          {isFeatured && (
            <p
              className="font-body text-white/75 mt-4"
              style={{
                fontSize: "clamp(0.9375rem, 1vw, 1rem)",
                lineHeight: 1.6,
                maxWidth: "52ch",
              }}
            >
              {item.description}
            </p>
          )}

          {/* 메트릭 — 1개 이상 노출 (Featured는 3개, 작은 카드는 1~2개) */}
          {item.metrics.length > 0 && (
            <div
              className={`mt-4 md:mt-5 flex flex-wrap gap-x-5 md:gap-x-6 gap-y-2 ${
                isFeatured ? "" : "max-w-[28ch]"
              }`}
            >
              {item.metrics.map((m) => (
                <div key={m.label} className="flex flex-col">
                  <span
                    className="font-heading font-semibold text-[rgb(var(--color-primary))]"
                    style={{
                      fontSize: isFeatured
                        ? "clamp(1.25rem, 1.7vw, 1.5rem)"
                        : "clamp(1rem, 1.3vw, 1.125rem)",
                      letterSpacing: "-0.01em",
                      fontVariantNumeric: "tabular-nums",
                      lineHeight: 1.1,
                    }}
                  >
                    {m.value}
                  </span>
                  <span
                    className="font-heading uppercase text-white/55 mt-1"
                    style={{
                      fontSize: isFeatured ? "10.5px" : "10px",
                      letterSpacing: "0.15em",
                    }}
                  >
                    {m.label}
                  </span>
                </div>
              ))}
            </div>
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
      key: "light",
      number: "01 / 05",
      title: items.light.title,
      description: items.light.description,
      metrics: items.light.metrics,
      cta: "Methodology",
      href: "/solutions/light-maintenance",
      photo: "/solutions/index-light.jpg",
      alt: "Light maintenance inspection at depot",
      size: "featured",
      objectPosition: "center 50%",
    },
    {
      key: "heavy",
      number: "02 / 05",
      title: items.heavy.title,
      description: items.heavy.description,
      metrics: items.heavy.metrics,
      cta: "Case studies",
      href: "/solutions/heavy-maintenance",
      photo: "/solutions/index-heavy.jpg",
      alt: "Heavy maintenance overhaul — component detail",
      size: "secondary",
      objectPosition: "center 35%",
    },
    {
      key: "supply",
      number: "03 / 05",
      title: items.supply.title,
      description: items.supply.description,
      metrics: items.supply.metrics,
      cta: "Partner network",
      href: "/solutions/supply-chain",
      photo: "/solutions/index-supply.webp",
      alt: "Rolling stock supply chain — parts and inventory",
      size: "tertiary",
      objectPosition: "20% 60%",
    },
    {
      key: "digital",
      number: "04 / 05",
      title: items.digital.title,
      description: items.digital.description,
      metrics: items.digital.metrics,
      cta: "See MMIS platform",
      href: "/solutions/digital-asset-management",
      photo: "/solutions/index-digital.jpg",
      alt: "MMIS digital asset management platform — work orders and inventory",
      size: "tertiary",
      objectPosition: "center 60%",
    },
    {
      key: "commercial",
      number: "05 / 05",
      title: items.commercial.title,
      description: items.commercial.description,
      metrics: items.commercial.metrics,
      cta: "Revenue programs",
      href: "/solutions/commercial-services",
      photo: "/solutions/index-commercial.jpg",
      alt: "Station concessions and commercial services",
      size: "tertiary",
      objectPosition: "75% 50%",
    },
  ];

  return (
    <section
      ref={ref}
      data-bg="dark"
      className="relative py-10 md:py-20 lg:py-24"
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
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-12 gap-3 md:gap-5">
          {solutions.map((item, i) => (
            <SolutionCard key={item.key} item={item} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
