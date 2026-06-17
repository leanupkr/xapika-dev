"use server";

import { headers } from "next/headers";
import { contactSchema } from "@/lib/contactSchema";
import {
  renderContactEmailHtml,
  renderContactEmailText,
} from "@/lib/contactEmail";
import { PL_ORIGIN } from "@/lib/seo-host";
import {
  resend,
  isResendConfigured,
  CONTACT_FROM_EMAIL,
  CONTACT_TO_EMAIL,
  CONTACT_CC_EMAIL,
} from "@/lib/resend";
import type { ContactInputShape, ContactState } from "./contactState";

// Best-effort in-memory rate limit. Each serverless instance keeps its own map,
// so this is a soft guard rather than a strict ceiling. Real protection is
// expected at the edge / behind a real KV (Upstash, Vercel KV) in production.
const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT_PER_WINDOW = 3;
const RATE_MAP: Map<string, number[]> = (() => {
  const g = globalThis as typeof globalThis & {
    __xapika_contact_rate__?: Map<string, number[]>;
  };
  if (!g.__xapika_contact_rate__) g.__xapika_contact_rate__ = new Map();
  return g.__xapika_contact_rate__;
})();

function takeRateLimit(key: string): boolean {
  const now = Date.now();
  const arr = RATE_MAP.get(key) ?? [];
  const fresh = arr.filter((t) => now - t < RATE_WINDOW_MS);
  if (fresh.length >= RATE_LIMIT_PER_WINDOW) {
    RATE_MAP.set(key, fresh);
    return false;
  }
  fresh.push(now);
  RATE_MAP.set(key, fresh);

  if (RATE_MAP.size > 1024) {
    for (const [k, v] of RATE_MAP) {
      const f = v.filter((t) => now - t < RATE_WINDOW_MS);
      if (f.length === 0) RATE_MAP.delete(k);
      else RATE_MAP.set(k, f);
    }
  }
  return true;
}

async function getRateLimitKey(): Promise<string> {
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "anonymous";
  const ua = (h.get("user-agent") ?? "").slice(0, 80);
  return `${ip}::${ua}`;
}

export async function submitContact(
  _prevState: ContactState | undefined,
  formData: FormData
): Promise<ContactState> {
  const raw = Object.fromEntries(formData.entries());
  const candidate = {
    firstName: String(raw.firstName ?? ""),
    lastName: String(raw.lastName ?? ""),
    company: String(raw.company ?? ""),
    email: String(raw.email ?? ""),
    phone: String(raw.phone ?? ""),
    location: String(raw.location ?? ""),
    subject: String(raw.subject ?? ""),
    message: String(raw.message ?? ""),
    consent: raw.consent === "on" || raw.consent === "true",
    honeypot: String(raw.honeypot ?? ""),
  };

  // Honeypot — bot filled the hidden field. Pretend success without sending.
  if (candidate.honeypot.trim() !== "") {
    console.warn("[contact] honeypot triggered — silently dropped");
    return { ok: true, ts: Date.now() };
  }

  const parsed = contactSchema.safeParse(candidate);
  if (!parsed.success) {
    const flat = parsed.error.flatten();
    const errors: Partial<Record<keyof ContactInputShape, string>> = {};
    for (const [key, msgs] of Object.entries(flat.fieldErrors)) {
      const first = Array.isArray(msgs) ? msgs[0] : undefined;
      if (first) errors[key as keyof ContactInputShape] = first;
    }
    return { ok: false, errors, ts: Date.now() };
  }

  // Rate limit (best-effort in-memory).
  const key = await getRateLimitKey();
  if (!takeRateLimit(key)) {
    return {
      ok: false,
      formError: "rate_limited",
      ts: Date.now(),
    };
  }

  // Derive which domain this inquiry was submitted from.
  const h = await headers();
  const hostRaw = h.get("host") ?? "";
  const bare = hostRaw.split(":")[0];
  const sourceDomain =
    bare === "xapika.co.kr" || bare.endsWith(".xapika.co.kr")
      ? "xapika.co.kr"
      : bare === "xapika.pl" || bare.endsWith(".xapika.pl")
      ? "xapika.pl"
      : bare || "xapika.pl";

  const data = parsed.data;
  const receivedAt = new Date().toISOString();

  // If Resend is not configured (no API key in env), accept the submission so
  // the form still functions in dev / preview, log the payload, and report ok.
  if (!isResendConfigured || !resend) {
    console.warn("[contact] Resend not configured — submission accepted but not delivered");
    return { ok: true, ts: Date.now() };
  }

  const emailData = {
    firstName: data.firstName,
    lastName: data.lastName,
    company: data.company,
    email: data.email,
    phone: data.phone || undefined,
    location: data.location,
    subject: data.subject,
    message: data.message,
    receivedAt,
    sourceDomain,
  };

  try {
    const result = await resend.emails.send({
      from: CONTACT_FROM_EMAIL,
      to: CONTACT_TO_EMAIL,
      cc: CONTACT_CC_EMAIL,
      replyTo: data.email,
      subject: `[Contact] ${data.subject}`,
      text: renderContactEmailText(emailData),
      html: renderContactEmailHtml(emailData, {
        logoSrc: `${PL_ORIGIN}/logo-white.png`,
        baseUrl: PL_ORIGIN,
      }),
    });

    if (result.error) {
      console.error("[contact] resend error", result.error);
      return {
        ok: false,
        formError: "send_failed",
        ts: Date.now(),
      };
    }

    return { ok: true, ts: Date.now() };
  } catch (err) {
    console.error("[contact] send threw", err);
    return {
      ok: false,
      formError: "send_failed",
      ts: Date.now(),
    };
  }
}
