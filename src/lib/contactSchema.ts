import { z } from "zod";

export const CONTACT_LOCATION_IDS = [
  "warsaw-hq",
  "warsaw-office",
  "kyiv",
  "seoul",
  "virginia",
  "istanbul",
  "tashkent",
  "other",
] as const;

export type ContactLocationId = (typeof CONTACT_LOCATION_IDS)[number];

export const contactSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, { message: "firstName_min" })
    .max(80, { message: "firstName_max" }),
  lastName: z
    .string()
    .trim()
    .min(2, { message: "lastName_min" })
    .max(80, { message: "lastName_max" }),
  company: z
    .string()
    .trim()
    .min(1, { message: "company_min" })
    .max(120, { message: "company_max" }),
  email: z
    .email({ message: "email_invalid" })
    .max(254, { message: "email_max" }),
  phone: z
    .string()
    .trim()
    .max(40, { message: "phone_max" })
    .regex(/^[+\d\s\-()]*$/u, { message: "phone_format" })
    .optional()
    .or(z.literal("")),
  location: z.enum(CONTACT_LOCATION_IDS, { message: "location_required" }),
  subject: z
    .string()
    .trim()
    .min(3, { message: "subject_min" })
    .max(160, { message: "subject_max" }),
  message: z
    .string()
    .trim()
    .min(20, { message: "message_min" })
    .max(2000, { message: "message_max" }),
  consent: z.literal(true, { message: "consent_required" }),
  honeypot: z.literal("", { message: "honeypot_invalid" }),
});

export type ContactInput = z.infer<typeof contactSchema>;
