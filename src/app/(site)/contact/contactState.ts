// Non-action exports for the contact server action.
//
// A `"use server"` file (actions.ts) may ONLY export async functions in this
// Next.js version. The shared types and the initial useActionState value live
// here so both the server action and the client form can import them without
// violating that constraint.

export type ContactInputShape = {
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
