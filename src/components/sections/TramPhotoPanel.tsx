"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";

type TramImage = {
  src: string;
  alt: string;
};

type TramPhotoPanelProps = {
  overline: string;
  note: string;
  images: ReadonlyArray<TramImage>;
};

export default function TramPhotoPanel({
  overline,
  note,
  images,
}: TramPhotoPanelProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      ref={ref}
      data-bg="surface"
      className="relative"
      style={{
        backgroundColor: "rgb(var(--color-surface))",
        paddingTop: "clamp(4rem, 8vh, 6rem)",
        paddingBottom: "clamp(4rem, 8vh, 6rem)",
        borderTop: "1px solid rgb(var(--color-ink) / 0.06)",
      }}
      aria-labelledby="tram-panel-overline"
    >
      <div
        className="mx-auto px-6 md:px-10 lg:px-16"
        style={{ maxWidth: "var(--max-width-content)" }}
      >
        <div className="flex items-center justify-between mb-8 md:mb-10">
          <motion.span
            id="tram-panel-overline"
            initial={{ opacity: 0, x: -16 }}
            animate={inView ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 font-heading font-medium uppercase text-[rgb(var(--color-primary))]"
            style={{ fontSize: "13px", letterSpacing: "0.22em" }}
          >
            <span
              aria-hidden="true"
              className="inline-block flex-shrink-0"
              style={{
                width: "24px",
                height: "2px",
                backgroundColor: "rgb(var(--color-primary))",
              }}
            />
            {overline}
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : undefined}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-heading font-medium uppercase truncate max-w-[60%] sm:max-w-none"
            style={{
              fontSize: "10.5px",
              letterSpacing: "0.18em",
              color: "rgb(var(--color-ink-muted))",
            }}
          >
            {note}
          </motion.span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{
                duration: 0.75,
                delay: 0.15 + i * 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative group overflow-hidden"
              style={{
                aspectRatio: i === 0 ? "4 / 5" : "5 / 6",
                backgroundColor: "rgb(var(--color-bg))",
              }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover transition-transform duration-[2400ms] ease-out group-hover:scale-[1.04]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none transition-opacity duration-[480ms] opacity-0 group-hover:opacity-100"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(11,31,58,0) 65%, rgba(11,31,58,0.45) 100%)",
                }}
              />
              <span
                className="absolute top-4 left-4 font-heading font-medium tabular-nums"
                style={{
                  fontSize: "10.5px",
                  letterSpacing: "0.22em",
                  color: "#fff",
                  textShadow: "0 1px 2px rgba(0,0,0,0.45)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {String(i + 1).padStart(2, "0")} / 02
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
