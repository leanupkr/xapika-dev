"use server";

import { headers } from "next/headers";
import { contactSchema } from "@/lib/contactSchema";
import {
  resend,
  isResendConfigured,
  CONTACT_FROM_EMAIL,
  CONTACT_TO_EMAIL,
  CONTACT_CC_EMAIL,
} from "@/lib/resend";

type ContactInputShape = {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;
  location: string;
  subject: string;
  message: string;
  consent: boolean;
  honeypot: string;
};

export type ContactState = {
  ok: boolean;
  errors?: Partial<Record<keyof ContactInputShape, string>>;
  formError?: string;
  ts?: number;
};

export const initialContactState: ContactState = { ok: false };

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

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderText(data: {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone?: string;
  location: string;
  subject: string;
  message: string;
  receivedAt: string;
}): string {
  const phoneLine = data.phone ? `\nPhone: ${data.phone}` : "";
  return [
    "[Xapika Contact Form]",
    "",
    `From: ${data.firstName} ${data.lastName} (${data.company})`,
    `Email: ${data.email}${phoneLine}`,
    `Closest office: ${data.location}`,
    `Subject: ${data.subject}`,
    "",
    "Message:",
    data.message,
    "",
    "—",
    `Submitted at ${data.receivedAt} via xapika.pl/contact`,
  ].join("\n");
}

function renderHtml(data: {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone?: string;
  location: string;
  subject: string;
  message: string;
  receivedAt: string;
}): string {
  const messageHtml = escapeHtml(data.message).replace(/\n/g, "<br/>");
  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 12px 6px 0;color:#475569;font-size:12px;text-transform:uppercase;letter-spacing:.16em;font-weight:500;white-space:nowrap;">${escapeHtml(
      label
    )}</td><td style="padding:6px 0;color:#0B1F3A;font-size:14px;">${value}</td></tr>`;

  const phoneRow = data.phone
    ? row(
        "Phone",
        `<a href="tel:${escapeHtml(data.phone)}" style="color:#0B1F3A;text-decoration:none;">${escapeHtml(
          data.phone
        )}</a>`
      )
    : "";

  return `<!doctype html>
<html><body style="margin:0;background:#F7F8FA;font-family:'Inter',ui-sans-serif,system-ui,sans-serif;color:#0B1F3A;">
  <div style="max-width:560px;margin:0 auto;padding:32px 24px;">
    <div style="display:inline-flex;align-items:center;gap:8px;font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:#f6a317;font-weight:600;">
      <span style="display:inline-block;width:24px;height:2px;background:#f6a317;"></span>
      Contact form
    </div>
    <h1 style="margin:14px 0 6px;font-size:22px;letter-spacing:-0.01em;color:#0B1F3A;">${escapeHtml(
      data.subject
    )}</h1>
    <p style="margin:0 0 24px;color:#475569;font-size:13.5px;line-height:1.55;">From <strong>${escapeHtml(
      data.firstName
    )} ${escapeHtml(data.lastName)}</strong> at <strong>${escapeHtml(
      data.company
    )}</strong>.</p>

    <table role="presentation" cellpadding="0" cellspacing="0" style="border-top:1px solid rgba(11,31,58,.10);border-bottom:1px solid rgba(11,31,58,.10);width:100%;margin:0 0 24px;">
      ${row(
        "Email",
        `<a href="mailto:${escapeHtml(data.email)}" style="color:#0B1F3A;text-decoration:none;">${escapeHtml(
          data.email
        )}</a>`
      )}
      ${phoneRow}
      ${row("Closest office", escapeHtml(data.location))}
    </table>

    <div style="font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#475569;margin:0 0 8px;">Message</div>
    <div style="background:#fff;border:1px solid rgba(11,31,58,.10);border-radius:6px;padding:16px 18px;font-size:14.5px;line-height:1.65;color:#0B1F3A;">
      ${messageHtml}
    </div>

    <p style="margin:24px 0 0;font-size:11px;color:#475569;letter-spacing:.04em;">Submitted at ${escapeHtml(
      data.receivedAt
    )} via xapika.pl/contact</p>
  </div>
</body></html>`;
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

  const data = parsed.data;
  const receivedAt = new Date().toISOString();

  // If Resend is not configured (no API key in env), accept the submission so
  // the form still functions in dev / preview, log the payload, and report ok.
  if (!isResendConfigured || !resend) {
    console.log("[contact] received submission (Resend not configured)", {
      ...data,
      receivedAt,
    });
    return { ok: true, ts: Date.now() };
  }

  try {
    const result = await resend.emails.send({
      from: CONTACT_FROM_EMAIL,
      to: CONTACT_TO_EMAIL,
      cc: CONTACT_CC_EMAIL,
      replyTo: data.email,
      subject: `[Contact] ${data.subject}`,
      text: renderText({ ...data, phone: data.phone || undefined, receivedAt }),
      html: renderHtml({ ...data, phone: data.phone || undefined, receivedAt }),
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
