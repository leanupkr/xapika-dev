"use client";

import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Shared GSAP scroll-reveal helpers.
 *
 * These extract two ~identical blocks that were copy-pasted across the content
 * sections (Vision, CeoMessage, OurClients, HistoryTimeline, WhatWeDo,
 * UzbekTimeline, RelatedProjects, …). Call them from inside `useGSAP`.
 */

/**
 * Stagger-reveal every `[data-header-item]` child of `headerEl` as it scrolls
 * into view. Mark the overline / heading / subtitle with `data-header-item`.
 * Honours reduced-motion by snapping them visible.
 */
export function revealHeaderItems(
  headerEl: HTMLElement | null,
  reduced: boolean,
): void {
  if (!headerEl) return;
  const targets = headerEl.querySelectorAll("[data-header-item]");
  if (!targets.length) return;

  if (reduced) {
    gsap.set(targets, { opacity: 1, x: 0, y: 0 });
    return;
  }

  gsap.fromTo(
    targets,
    { opacity: 0, y: 16 },
    {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.12,
      ease: "power3.out",
      scrollTrigger: {
        trigger: headerEl,
        start: "top 82%",
        toggleActions: "play none none none",
      },
    },
  );
}

/**
 * Kill every ScrollTrigger whose trigger element lives inside `sectionEl`.
 * Standard teardown for a section-scoped `useGSAP` timeline; return this from
 * the `useGSAP` callback.
 */
export function killScrollTriggersWithin(sectionEl: HTMLElement | null): void {
  ScrollTrigger.getAll()
    .filter((st) => sectionEl?.contains(st.trigger as Node))
    .forEach((st) => st.kill());
}
