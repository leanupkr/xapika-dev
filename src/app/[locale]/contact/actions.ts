"use server";

import { contactSchema } from "@/lib/contactSchema";

export type ContactActionResult =
  | { ok: true }
  | {
      ok: false;
      errors: Partial<Record<keyof ContactInputShape, string>>;
      formError?: string;
    };

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

export async function submitContact(
  formData: FormData
): Promise<ContactActionResult> {
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

  const parsed = contactSchema.safeParse(candidate);
  if (!parsed.success) {
    const flat = parsed.error.flatten();
    const errors: Partial<Record<keyof ContactInputShape, string>> = {};
    for (const [key, msgs] of Object.entries(flat.fieldErrors)) {
      const first = Array.isArray(msgs) ? msgs[0] : undefined;
      if (first) errors[key as keyof ContactInputShape] = first;
    }
    return { ok: false, errors };
  }

  // TODO(0017): Resend integration + reCAPTCHA verification.
  console.log("[contact] received submission", {
    ...parsed.data,
    receivedAt: new Date().toISOString(),
  });

  return { ok: true };
}
