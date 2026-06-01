"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);

  // Reduced-motion is honoured PER COMPONENT via prefersReducedMotion()
  // (heroes snap content visible, reveals skip their tweens). We deliberately
  // do NOT freeze gsap.globalTimeline.timeScale(0) here: a global freeze strands
  // every fromTo() tween at its opacity:0 `from` state, which left PageHero /
  // AboutHeader headlines permanently invisible for reduced-motion users.
}

export { gsap, ScrollTrigger, useGSAP };

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
