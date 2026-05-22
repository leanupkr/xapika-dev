"use client";

import {
  useActionState,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  contactSchema,
  CONTACT_LOCATION_IDS,
  type ContactInput,
} from "@/lib/contactSchema";
import {
  submitContact,
  initialContactState,
  type ContactState,
} from "@/app/contact/actions";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const DRAFT_KEY = "xapika-contact-draft";

const ERRORS: Record<string, string> = {
  firstName_min:    "Please enter at least 2 characters.",
  firstName_max:    "First name is too long.",
  lastName_min:     "Please enter at least 2 characters.",
  lastName_max:     "Last name is too long.",
  company_min:      "Please enter your company name.",
  company_max:      "Company name is too long.",
  email_invalid:    "Please enter a valid email address.",
  email_max:        "Email address is too long.",
  phone_format:     "Phone may include digits, spaces, +, -, ().",
  phone_max:        "Phone number is too long.",
  location_required:"Please select the closest office.",
  subject_min:      "Subject must be at least 3 characters.",
  subject_max:      "Subject is too long.",
  message_min:      "Please share at least 20 characters so we can route your inquiry.",
  message_max:      "Message is too long (2000 character limit).",
  consent_required: "Please agree before sending the message.",
  honeypot_invalid: "Submission rejected.",
  generic:          "Please review this field.",
  formError:        "Something went wrong. Please review the form and try again.",
  network:          "We could not reach the server. Please retry in a moment.",
  rate_limited:     "You're sending requests too quickly. Please wait a minute and try again.",
  send_failed:      "We received your message but couldn't deliver it just now. Please try again or email us directly.",
};

const LOCATION_LABELS: Record<string, string> = {
  "warsaw-hq":    "Warsaw — HQ",
  "warsaw-office":"Warsaw — Office",
  "kyiv":         "Kyiv",
  "seoul":        "Seoul",
  "sao-paulo":    "São Paulo",
  "virginia":     "Virginia",
  "istanbul":     "Istanbul",
  "tashkent":     "Tashkent",
  "cairo":        "Cairo",
  "other":        "Other / not listed",
};

function safeT(key: string, fallback: string = "generic"): string {
  return ERRORS[key] ?? ERRORS[fallback] ?? key;
}

const FIELD_INPUT_BASE: React.CSSProperties = {
  width: "100%",
  background: "transparent",
  border: "none",
  borderBottom: "1px solid rgba(11,31,58,0.18)",
  borderRadius: 0,
  padding: "12px 0",
  fontFamily: "var(--font-body)",
  fontSize: "15px",
  color: "rgb(var(--color-ink))",
  outline: "none",
  transition: "border-color 0.2s",
};

type ContactFormProps = {
  externalSubject?: string;
  autoFocusKey?: string | null;
};

export default function ContactForm({
  externalSubject,
  autoFocusKey,
}: ContactFormProps) {
  const router = useRouter();

  const [state, formAction, pending] = useActionState<ContactState, FormData>(
    submitContact,
    initialContactState
  );
  const [formError, setFormError] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, dirtyFields },
    setError,
    reset,
    setValue,
    watch,
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
    shouldFocusError: true,
    defaultValues: {
      firstName: "",
      lastName: "",
      company: "",
      email: "",
      phone: "",
      // @ts-expect-error — empty string is intentional initial state for select
      location: "",
      subject: "",
      message: "",
      // @ts-expect-error — false is intentional initial state for required-true literal
      consent: false,
      honeypot: "",
    },
  });

  // Restore from sessionStorage on mount
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, unknown>;
        // consent is always false on restore; honeypot excluded
        delete parsed.honeypot;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        reset({ ...(parsed as any), consent: false } as unknown as ContactInput);
      }
    } catch {
      /* ignore parse errors */
    }
  }, [reset]);

  // sessionStorage auto-save with debounce
  useEffect(() => {
    const subscription = watch((values) => {
      const handle = setTimeout(() => {
        try {
          const toSave: Record<string, unknown> = { ...values };
          delete toSave.honeypot;
          delete toSave.consent;
          sessionStorage.setItem(DRAFT_KEY, JSON.stringify(toSave));
        } catch {
          /* ignore storage errors */
        }
      }, 500);
      return () => clearTimeout(handle);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // Sync external subject when not dirty
  useEffect(() => {
    if (!externalSubject) return;
    if (dirtyFields.subject) return;
    setValue("subject", externalSubject);
  }, [externalSubject, dirtyFields.subject, setValue]);

  // Auto-focus firstName when intent changes
  useEffect(() => {
    if (autoFocusKey == null) return;
    const raf = requestAnimationFrame(() => {
      firstNameRef.current?.focus();
    });
    return () => cancelAnimationFrame(raf);
  }, [autoFocusKey]);

  // React to server-action state changes
  useEffect(() => {
    if (!state?.ts) return;
    if (state.ok) {
      reset();
      try {
        sessionStorage.removeItem(DRAFT_KEY);
      } catch {
        /* ignore */
      }
      router.replace("/contact/thank-you");
      return;
    }
    if (state.errors) {
      for (const [field, code] of Object.entries(state.errors)) {
        if (!code) continue;
        setError(field as keyof ContactInput, {
          type: "server",
          message: code,
        });
      }
    }
    if (state.formError) {
      const known = new Set(["rate_limited", "send_failed"]);
      const key = known.has(state.formError) ? state.formError : "formError";
      setFormError(safeT(key, "formError"));
    } else if (state.errors) {
      setFormError(safeT("formError"));
    }
  }, [state, reset, router, setError]);

  const errMsg = (key: keyof ContactInput): string | null => {
    const code = errors[key]?.message;
    if (!code) return null;
    return safeT(code as string, "generic");
  };

  const busy = pending || isSubmitting;

  // Enter key progression handler
  const handleFormKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLFormElement>) => {
      if (e.key !== "Enter") return;
      const target = e.target as HTMLElement;
      const tag = target.tagName.toLowerCase();
      // Allow default Enter in textarea
      if (tag === "textarea") return;
      // Only intercept input and select
      if (tag !== "input" && tag !== "select") return;
      // Allow checkbox default
      if ((target as HTMLInputElement).type === "checkbox") return;

      const form = formRef.current;
      if (!form) return;

      const focusable = Array.from(
        form.querySelectorAll<HTMLInputElement | HTMLSelectElement>(
          "input:not([type=hidden]):not([type=checkbox]), select"
        )
      );
      const idx = focusable.indexOf(target as HTMLInputElement);
      if (idx !== -1 && idx < focusable.length - 1) {
        e.preventDefault();
        focusable[idx + 1].focus();
      }
    },
    []
  );

  const onSubmit = handleSubmit(
    (data) => {
      setFormError(null);
      const fd = new FormData();
      fd.set("firstName", data.firstName);
      fd.set("lastName", data.lastName);
      fd.set("company", data.company);
      fd.set("email", data.email);
      fd.set("phone", data.phone ?? "");
      fd.set("location", data.location);
      fd.set("subject", data.subject);
      fd.set("message", data.message);
      fd.set("consent", data.consent ? "on" : "");
      fd.set("honeypot", data.honeypot ?? "");
      formAction(fd);
    },
    (invalidFields) => {
      // Scroll first error field into view
      const firstKey = Object.keys(invalidFields)[0] as keyof ContactInput;
      if (!firstKey) return;
      const el = formRef.current?.querySelector<HTMLElement>(
        `[id="${firstKey}"]`
      );
      if (el) {
        el.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    }
  );

  const subjectLen = watch("subject")?.length ?? 0;
  const messageLen = watch("message")?.length ?? 0;

  return (
    <motion.form
      ref={formRef}
      noValidate
      onSubmit={onSubmit}
      onKeyDown={handleFormKeyDown}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="relative"
      aria-busy={busy}
      aria-label="Contact form"
    >
      {/* Inline form-level error banner */}
      {formError && (
        <div
          role="alert"
          className="flex items-start gap-3 mb-6 p-4 rounded-md"
          style={{
            backgroundColor: "rgba(246,163,23,0.08)",
            border: "1px solid rgba(246,163,23,0.45)",
          }}
        >
          <AlertCircle
            size={16}
            strokeWidth={1.75}
            className="mt-0.5 flex-shrink-0"
            style={{ color: "rgb(var(--color-primary))" }}
          />
          <p
            className="font-body"
            style={{
              fontSize: "13.5px",
              color: "rgb(var(--color-ink))",
              lineHeight: 1.55,
            }}
          >
            {formError}
          </p>
        </div>
      )}

      {/* honeypot — visually hidden, off-screen */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{ left: "-9999px", top: 0, opacity: 0 }}
      >
        <label>
          Leave this field empty
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...register("honeypot")}
          />
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-7">
        <Field
          id="firstName"
          label="First name"
          placeholder="Anna"
          autoComplete="given-name"
          register={register("firstName")}
          error={errMsg("firstName")}
          disabled={busy}
          inputRef={firstNameRef}
        />
        <Field
          id="lastName"
          label="Last name"
          placeholder="Kowalski"
          autoComplete="family-name"
          register={register("lastName")}
          error={errMsg("lastName")}
          disabled={busy}
        />
        <div className="sm:col-span-2">
          <Field
            id="company"
            label="Company"
            placeholder="Company / Organization"
            autoComplete="organization"
            register={register("company")}
            error={errMsg("company")}
            disabled={busy}
          />
        </div>
        <Field
          id="email"
          type="email"
          label="Work email"
          placeholder="you@company.com"
          autoComplete="email"
          register={register("email")}
          error={errMsg("email")}
          disabled={busy}
        />
        <Field
          id="phone"
          type="tel"
          label="Phone (optional)"
          placeholder="+48 22 ..."
          autoComplete="tel"
          register={register("phone")}
          error={errMsg("phone")}
          disabled={busy}
        />
        <div className="sm:col-span-2">
          <SelectField
            id="location"
            label="Closest office"
            placeholder="Select an office"
            options={CONTACT_LOCATION_IDS.map((id) => ({
              value: id,
              label: LOCATION_LABELS[id] ?? id,
            }))}
            register={register("location")}
            error={errMsg("location")}
            disabled={busy}
          />
        </div>
        <div className="sm:col-span-2">
          <FieldShell
            id="subject"
            label="Subject"
            error={errMsg("subject")}
            counter={
              <CharCounter current={subjectLen} max={160} />
            }
          >
            <SubjectInput
              id="subject"
              placeholder="Project name or inquiry topic"
              register={register("subject")}
              error={errMsg("subject")}
              disabled={busy}
            />
          </FieldShell>
        </div>
        <div className="sm:col-span-2">
          <FieldShell
            id="message"
            label="Message"
            error={errMsg("message")}
            counter={
              <CharCounter current={messageLen} max={2000} />
            }
          >
            <TextareaInput
              id="message"
              placeholder="Tell us about your operations needs — fleet size, timeline, regulators."
              register={register("message")}
              error={errMsg("message")}
              disabled={busy}
            />
          </FieldShell>
        </div>
        <div className="sm:col-span-2">
          <CheckboxField
            id="consent"
            label="I agree to the processing of my personal data per the privacy policy."
            register={register("consent")}
            error={errMsg("consent")}
            disabled={busy}
          />
        </div>
      </div>

      {/* Submit row */}
      <div className="mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p
          className="font-body"
          style={{
            fontSize: "12px",
            color: "rgba(11,31,58,0.50)",
            letterSpacing: "0.02em",
          }}
        >
          Typical response within 2 business days.
        </p>
        <SubmitButton busy={busy} label="Send message" submittingLabel="Sending…" />
      </div>
    </motion.form>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

type RegisterReturn = ReturnType<
  ReturnType<typeof useForm<ContactInput>>["register"]
>;

type FieldBaseProps = {
  id: string;
  label: string;
  placeholder?: string;
  error: string | null;
  disabled?: boolean;
  register: RegisterReturn;
};

function FieldShell({
  id,
  label,
  error,
  counter,
  children,
}: {
  id: string;
  label: string;
  error: string | null;
  counter?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label
          htmlFor={id}
          className="block font-heading font-medium uppercase"
          style={{
            fontSize: "11px",
            letterSpacing: "0.18em",
            color: error
              ? "rgb(var(--color-primary))"
              : "rgba(11,31,58,0.62)",
            transition: "color 0.2s",
          }}
        >
          {label}
        </label>
      </div>
      {children}
      <div className="flex items-start justify-between mt-1.5">
        <div>
          {error && (
            <p
              id={`${id}-error`}
              role="alert"
              aria-live="assertive"
              className="font-body"
              style={{
                fontSize: "12px",
                color: "rgb(var(--color-primary))",
                letterSpacing: "0.02em",
              }}
            >
              {error}
            </p>
          )}
        </div>
        {counter && <div>{counter}</div>}
      </div>
    </div>
  );
}

function CharCounter({ current, max }: { current: number; max: number }) {
  const ratio = current / max;
  let color = "rgba(11,31,58,0.60)";
  if (ratio > 1) color = "#DC2626";
  else if (ratio >= 0.8) color = "rgb(var(--color-primary))";

  return (
    <span
      className="font-body"
      style={{
        fontSize: "11px",
        color,
        letterSpacing: "0.02em",
        whiteSpace: "nowrap",
      }}
      aria-live="polite"
      aria-label={`${current} of ${max} characters`}
    >
      {current} / {max}
    </span>
  );
}

function Field({
  id,
  label,
  placeholder,
  type = "text",
  autoComplete,
  register,
  error,
  disabled,
  inputRef,
}: FieldBaseProps & {
  type?: string;
  autoComplete?: string;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}) {
  const [focused, setFocused] = useState(false);

  // Merge register's ref with optional inputRef via callback
  const { ref: registerRef, ...registerRest } = register;
  const callbackRef = useCallback(
    (el: HTMLInputElement | null) => {
      registerRef(el);
      if (inputRef) {
        (inputRef as React.MutableRefObject<HTMLInputElement | null>).current = el;
      }
    },
    [registerRef, inputRef]
  );

  return (
    <FieldShell id={id} label={label} error={error}>
      <input
        ref={callbackRef}
        id={id}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        {...registerRest}
        onFocus={(e) => {
          registerRest.onBlur({ ...e, type: "focus" } as never);
          setFocused(true);
        }}
        onBlur={(e) => {
          registerRest.onBlur(e);
          setFocused(false);
        }}
        style={{
          ...FIELD_INPUT_BASE,
          borderBottomColor: error
            ? "rgb(var(--color-primary))"
            : focused
              ? "rgb(var(--color-primary))"
              : "rgba(11,31,58,0.18)",
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? "not-allowed" : "text",
        }}
      />
    </FieldShell>
  );
}

function SubjectInput({
  id,
  placeholder,
  register,
  error,
  disabled,
}: Omit<FieldBaseProps, "label">) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      id={id}
      type="text"
      placeholder={placeholder}
      disabled={disabled}
      aria-invalid={!!error}
      aria-describedby={error ? `${id}-error` : undefined}
      {...register}
      onFocus={(e) => {
        register.onBlur({ ...e, type: "focus" } as never);
        setFocused(true);
      }}
      onBlur={(e) => {
        register.onBlur(e);
        setFocused(false);
      }}
      style={{
        ...FIELD_INPUT_BASE,
        borderBottomColor: error
          ? "rgb(var(--color-primary))"
          : focused
            ? "rgb(var(--color-primary))"
            : "rgba(11,31,58,0.18)",
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : "text",
      }}
    />
  );
}

function TextareaInput({
  id,
  placeholder,
  register,
  error,
  disabled,
}: Omit<FieldBaseProps, "label">) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      id={id}
      placeholder={placeholder}
      disabled={disabled}
      rows={5}
      aria-invalid={!!error}
      aria-describedby={error ? `${id}-error` : undefined}
      {...register}
      onFocus={(e) => {
        setFocused(true);
        register.onBlur({ ...e, type: "focus" } as never);
      }}
      onBlur={(e) => {
        setFocused(false);
        register.onBlur(e);
      }}
      style={{
        ...FIELD_INPUT_BASE,
        minHeight: "120px",
        padding: "12px 0",
        resize: "vertical",
        borderBottomColor: error
          ? "rgb(var(--color-primary))"
          : focused
            ? "rgb(var(--color-primary))"
            : "rgba(11,31,58,0.18)",
        lineHeight: 1.55,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : "text",
      }}
    />
  );
}

function SelectField({
  id,
  label,
  placeholder,
  options,
  register,
  error,
  disabled,
}: FieldBaseProps & {
  options: ReadonlyArray<{ value: string; label: string }>;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <FieldShell id={id} label={label} error={error}>
      <div className="relative">
        <select
          id={id}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...register}
          onFocus={() => setFocused(true)}
          onBlur={(e) => {
            setFocused(false);
            register.onBlur(e);
          }}
          style={{
            ...FIELD_INPUT_BASE,
            appearance: "none",
            WebkitAppearance: "none",
            MozAppearance: "none",
            paddingRight: "32px",
            borderBottomColor: error
              ? "rgb(var(--color-primary))"
              : focused
                ? "rgb(var(--color-primary))"
                : "rgba(11,31,58,0.18)",
            opacity: disabled ? 0.5 : 1,
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <span
          aria-hidden
          className="absolute pointer-events-none"
          style={{
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
            color: "rgba(11,31,58,0.45)",
            fontSize: "10px",
            letterSpacing: "0.18em",
          }}
        >
          ▾
        </span>
      </div>
    </FieldShell>
  );
}

function CheckboxField({
  id,
  label,
  register,
  error,
  disabled,
}: Omit<FieldBaseProps, "placeholder">) {
  return (
    <div>
      <label
        htmlFor={id}
        className="flex items-start gap-3 cursor-pointer select-none"
        style={{ opacity: disabled ? 0.6 : 1 }}
      >
        <input
          id={id}
          type="checkbox"
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...register}
          className="mt-0.5 flex-shrink-0"
          style={{
            width: "16px",
            height: "16px",
            accentColor: "rgb(var(--color-primary))",
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        />
        <span
          className="font-body"
          style={{
            fontSize: "13.5px",
            color: "rgba(11,31,58,0.78)",
            lineHeight: 1.55,
          }}
        >
          {label}
        </span>
      </label>
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          aria-live="assertive"
          className="mt-1.5 ml-7 font-body"
          style={{
            fontSize: "12px",
            color: "rgb(var(--color-primary))",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

function SubmitButton({
  busy,
  label,
  submittingLabel,
}: {
  busy: boolean;
  label: string;
  submittingLabel: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="submit"
      disabled={busy}
      className="inline-flex items-center justify-center gap-2 font-heading font-semibold rounded-lg transition-all duration-200"
      style={{
        fontSize: "15px",
        padding: "14px 30px",
        backgroundColor: busy
          ? "rgba(11,31,58,0.45)"
          : hovered
            ? "rgb(var(--color-primary))"
            : "rgb(var(--color-ink))",
        color: hovered && !busy ? "rgb(var(--color-ink))" : "#ffffff",
        opacity: busy ? 0.6 : 1,
        cursor: busy ? "not-allowed" : "pointer",
        boxShadow: busy
          ? "none"
          : "inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 14px rgba(11,31,58,0.18)",
      }}
      onMouseEnter={() => !busy && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {busy ? (
        <>
          <Loader2 size={16} strokeWidth={2} className="animate-spin" />
          {submittingLabel}
        </>
      ) : (
        <>
          {label}
          <ArrowRight size={16} strokeWidth={2} />
        </>
      )}
    </button>
  );
}
