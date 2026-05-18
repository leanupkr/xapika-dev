"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";

export type WhatWeDoItem = {
  index: string;
  title: string;
  desc: string;
};

type WhatWeDoProps = {
  overline: string;
  title: string;
  items: ReadonlyArray<WhatWeDoItem>;
};

export default function WhatWeDo({ overline, title, items }: WhatWeDoProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      const prefersReduced = prefersReducedMotion();

      if (headerRef.current) {
        const headerTargets = headerRef.current.querySelectorAll(
          "[data-header-item]"
        );
        if (prefersReduced) {
          gsap.set(headerTargets, { opacity: 1, y: 0 });
        } else {
          gsap.fromTo(
            headerTargets,
            { opacity: 0, y: 16 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.12,
              ease: "power3.out",
              scrollTrigger: {
                trigger: headerRef.current,
                start: "top 82%",
                toggleActions: "play none none none",
              },
            }
          );
        }
      }

      if (listRef.current) {
        const rows = listRef.current.querySelectorAll("[data-wwd-item]");
        if (prefersReduced) {
          gsap.set(rows, { opacity: 1, y: 0 });
        } else {
          gsap.fromTo(
            rows,
            { opacity: 0, y: 18 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.08,
              ease: "power3.out",
              scrollTrigger: {
                trigger: listRef.current,
                start: "top 80%",
                toggleActions: "play none none none",
              },
            }
          );
        }
      }

      return () => {
        ScrollTrigger.getAll()
          .filter((st) => sectionRef.current?.contains(st.trigger as Node))
          .forEach((st) => st.kill());
      };
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative bg-[rgb(var(--color-bg))]"
      style={{
        paddingTop: "clamp(5rem, 12vh, 8rem)",
        paddingBottom: "clamp(5rem, 12vh, 8rem)",
      }}
      aria-labelledby="wwd-title"
    >
      <div
        className="mx-auto px-6 md:px-10 lg:px-16"
        style={{ maxWidth: "var(--max-width-content)" }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-6 md:gap-y-10 lg:gap-y-0 lg:gap-x-12">
          {/* Left — sticky header */}
          <div ref={headerRef} className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <span
                data-header-item
                className="flex items-center gap-3 font-heading font-medium uppercase mb-6 text-[rgb(var(--color-primary))] opacity-0"
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
              </span>

              <h2
                id="wwd-title"
                data-header-item
                className="font-heading font-semibold text-[rgb(var(--color-ink))] opacity-0"
                style={{
                  fontSize: "clamp(1.875rem, 3.6vw, 2.75rem)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                  maxWidth: "20ch",
                }}
              >
                {title}
              </h2>
            </div>
          </div>

          {/* Right — items list */}
          <ul
            ref={listRef}
            className="lg:col-span-7 list-none m-0 p-0"
            style={{ borderTop: "1px solid rgb(var(--color-ink) / 0.10)" }}
          >
            {items.map((item) => (
              <li
                key={item.index}
                data-wwd-item
                className="group relative opacity-0"
                style={{
                  borderBottom: "1px solid rgb(var(--color-ink) / 0.10)",
                }}
              >
                <div
                  className="grid grid-cols-12 gap-3 md:gap-6 items-start py-4 md:py-8 transition-colors duration-300"
                >
                  {/* Index */}
                  <div className="col-span-2 md:col-span-1">
                    <span
                      className="font-heading font-medium tabular-nums text-[rgb(var(--color-ink-muted))] group-hover:text-[rgb(var(--color-primary))] transition-colors duration-300"
                      style={{
                        fontSize: "13px",
                        letterSpacing: "0.18em",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {item.index}
                    </span>
                  </div>

                  {/* Title */}
                  <div className="col-span-10 md:col-span-4">
                    <h3
                      className="font-heading font-semibold text-[rgb(var(--color-ink))]"
                      style={{
                        fontSize: "clamp(1.125rem, 1.6vw, 1.375rem)",
                        letterSpacing: "-0.015em",
                        lineHeight: 1.25,
                      }}
                    >
                      {item.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <div className="col-span-12 md:col-span-7">
                    <p
                      className="font-body text-[rgb(var(--color-ink-muted))]"
                      style={{
                        fontSize: "clamp(0.9375rem, 1vw, 1rem)",
                        lineHeight: 1.6,
                      }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>

                {/* Left primary accent — slides in on hover */}
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 bottom-0 origin-top scale-y-0 transition-transform duration-[320ms] ease-out group-hover:scale-y-100"
                  style={{
                    width: "2px",
                    backgroundColor: "rgb(var(--color-primary))",
                  }}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
