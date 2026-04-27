import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

export const resend = apiKey ? new Resend(apiKey) : null;

export const isResendConfigured = !!apiKey;

export const CONTACT_FROM_EMAIL =
  process.env.CONTACT_FROM_EMAIL ?? "Xapika Contact <noreply@xapika.pl>";

export const CONTACT_TO_EMAIL =
  process.env.CONTACT_TO_EMAIL ?? "info@xapika.pl";

export const CONTACT_CC_EMAIL = process.env.CONTACT_CC_EMAIL || undefined;
