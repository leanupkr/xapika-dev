import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import JsonLd, { breadcrumbLd } from "@/components/seo/JsonLd";

export function generateMetadata(): Metadata {
  return {
    title: "Your message is on track. — Xapika Engineering",
    description:
      "We'll respond within 2 business days — usually faster. If your inquiry is operational and time-sensitive, mention it in the subject line.",
    robots: { index: false, follow: false },
  };
}

export default function ThankYouPage() {
  return (
    <>
      <JsonLd
        id="ld-breadcrumb"
        data={breadcrumbLd({
          trail: [
            { name: "Contact Us", path: "contact" },
            { name: "Your message is on track.", path: "contact/thank-you" },
          ],
        })}
      />
      <section
        data-bg="dark"
        className="relative overflow-hidden flex items-center justify-center"
      style={{
        backgroundColor: "rgb(var(--color-ink))",
        minHeight: "calc(100vh - 80px)",
        paddingTop: "clamp(7rem, 14vh, 10rem)",
        paddingBottom: "clamp(5rem, 10vh, 8rem)",
      }}
    >
      {/* Subtle rail-grid pattern */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.05 }}
      >
        <defs>
          <pattern
            id="rail-grid-thanks"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <line x1="20" y1="0" x2="20" y2="80" stroke="#fff" strokeWidth="1" />
            <line x1="60" y1="0" x2="60" y2="80" stroke="#fff" strokeWidth="1" />
            <line x1="10" y1="20" x2="70" y2="20" stroke="#fff" strokeWidth="1" />
            <line x1="10" y1="50" x2="70" y2="50" stroke="#fff" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#rail-grid-thanks)" />
      </svg>

      <div
        aria-hidden
        className="absolute top-0 right-0 w-[60%] h-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 100% 50%, rgba(246,163,23,0.10) 0%, transparent 65%)",
        }}
      />

      <div
        className="relative z-10 mx-auto px-6 md:px-10 lg:px-16 w-full text-center"
        style={{ maxWidth: "720px" }}
      >
        <div
          className="inline-flex items-center justify-center mb-8"
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            backgroundColor: "rgba(246,163,23,0.12)",
            border: "1px solid rgba(246,163,23,0.45)",
          }}
        >
          <CheckCircle2
            size={28}
            strokeWidth={1.75}
            style={{ color: "rgb(var(--color-primary))" }}
          />
        </div>

        <span
          className="block font-heading font-medium uppercase mb-5"
          style={{
            fontSize: "13px",
            letterSpacing: "0.22em",
            color: "rgb(var(--color-primary))",
          }}
        >
          Received
        </span>

        <h1
          className="font-heading font-semibold text-white mb-4"
          style={{
            fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
            letterSpacing: "-0.02em",
            lineHeight: 1.08,
          }}
        >
          Your message is on track.
        </h1>

        {/* Signature rail — draws in left → right on mount */}
        <div
          aria-hidden="true"
          className="flex items-center justify-center mb-7"
          style={{ height: "12px" }}
        >
          <span className="track-line" />
        </div>

        <p
          className="font-body mb-10 mx-auto"
          style={{
            fontSize: "clamp(1rem, 1.3vw, 1.125rem)",
            color: "rgba(255,255,255,0.72)",
            lineHeight: 1.65,
            maxWidth: "520px",
          }}
        >
          We&apos;ll respond within 2 business days — usually faster. If your inquiry is operational and time-sensitive, mention it in the subject line.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 font-heading font-medium rounded-lg transition-all duration-200"
          style={{
            fontSize: "14px",
            padding: "12px 22px",
            border: "1px solid rgba(255,255,255,0.25)",
            color: "#ffffff",
            backgroundColor: "rgba(255,255,255,0.05)",
          }}
        >
          <ArrowLeft size={14} strokeWidth={2} />
          Back to home
        </Link>
      </div>
    </section>
    </>
  );
}
