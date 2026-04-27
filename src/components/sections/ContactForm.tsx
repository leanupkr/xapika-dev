"use client";

import { useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import {
  contactSchema,
  CONTACT_LOCATION_IDS,
  type ContactInput,
  type ContactLocationId,
} from "@/lib/contactSchema";
import {
  submitContact,
  initialContactState,
  type ContactState,
} from "@/app/[locale]/contact/actions";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function safeT(
  t: (key: string) => string,
  key: string,
  fallback: string = "generic"
): string {
  try {
    const v = t(key);
    if (typeof v === "string" && !v.startsWith("contactPage.errors.")) return v;
  } catch {
    /* missing key */
  }
  try {
    return t(fallback);
  } catch {
    return key;
  }
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
  transition: "border-color 0.25s var(--ease-out)",
};

export default function ContactForm() {
  const t = useTranslations("contactPage.form");
  const tErr = useTranslations("contactPage.errors");
  const router = useRouter();

  const [state, formAction, pending] = useActionState<ContactState, FormData>(
    submitContact,
    initialContactState
  );
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
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

  const onSubmit = handleSubmit((data) => {
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
  });

  // React to server-action state changes.
  useEffect(() => {
    if (!state?.ts) return;
    if (state.ok) {
      reset();
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
      setFormError(safeT(tErr, key, "formError"));
    } else if (state.errors) {
      setFormError(safeT(tErr, "formError"));
    }
  }, [state, reset, router, setError, tErr]);

  const errMsg = (key: keyof ContactInput): string | null => {
    const code = errors[key]?.message;
    if (!code) return null;
    return safeT(tErr, code as string, "generic");
  };

  const busy = pending || isSubmitting;

  return (
    <motion.form
      noValidate
      onSubmit={onSubmit}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="relative"
      aria-busy={busy}
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
      <div aria-hidden="true" className="absolute pointer-events-none" style={{ left: "-9999px", top: 0, opacity: 0 }}>
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
          label={t("firstName.label")}
          placeholder={t("firstName.placeholder")}
          autoComplete="given-name"
          register={register("firstName")}
          error={errMsg("firstName")}
          disabled={busy}
        />
        <Field
          id="lastName"
          label={t("lastName.label")}
          placeholder={t("lastName.placeholder")}
          autoComplete="family-name"
          register={register("lastName")}
          error={errMsg("lastName")}
          disabled={busy}
        />
        <div className="sm:col-span-2">
          <Field
            id="company"
            label={t("company.label")}
            placeholder={t("company.placeholder")}
            autoComplete="organization"
            register={register("company")}
            error={errMsg("company")}
            disabled={busy}
          />
        </div>
        <Field
          id="email"
          type="email"
          label={t("email.label")}
          placeholder={t("email.placeholder")}
          autoComplete="email"
          register={register("email")}
          error={errMsg("email")}
          disabled={busy}
        />
        <Field
          id="phone"
          type="tel"
          label={t("phone.label")}
          placeholder={t("phone.placeholder")}
          autoComplete="tel"
          register={register("phone")}
          error={errMsg("phone")}
          disabled={busy}
        />
        <div className="sm:col-span-2">
          <SelectField
            id="location"
            label={t("location.label")}
            placeholder={t("location.placeholder")}
            options={CONTACT_LOCATION_IDS.map((id) => ({
              value: id,
              label: t(`location.options.${id}` as `location.options.${ContactLocationId}`),
            }))}
            register={register("location")}
            error={errMsg("location")}
            disabled={busy}
          />
        </div>
        <div className="sm:col-span-2">
          <Field
            id="subject"
            label={t("subject.label")}
            placeholder={t("subject.placeholder")}
            register={register("subject")}
            error={errMsg("subject")}
            disabled={busy}
          />
        </div>
        <div className="sm:col-span-2">
          <TextareaField
            id="message"
            label={t("message.label")}
            placeholder={t("message.placeholder")}
            register={register("message")}
            error={errMsg("message")}
            disabled={busy}
            maxLength={2000}
          />
        </div>
        <div className="sm:col-span-2">
          <CheckboxField
            id="consent"
            label={t("consent.label")}
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
          {t("responseNote")}
        </p>
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center justify-center gap-2 font-heading font-semibold rounded-lg transition-all duration-200"
          style={{
            fontSize: "15px",
            padding: "14px 30px",
            backgroundColor: busy
              ? "rgba(11,31,58,0.45)"
              : "rgb(var(--color-ink))",
            color: "#ffffff",
            opacity: busy ? 0.6 : 1,
            cursor: busy ? "not-allowed" : "pointer",
            boxShadow: busy
              ? "none"
              : "inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 14px rgba(11,31,58,0.18)",
          }}
        >
          {busy ? (
            <>
              <Loader2 size={16} strokeWidth={2} className="animate-spin" />
              {t("submitting")}
            </>
          ) : (
            <>
              {t("submit")}
              <ArrowRight size={16} strokeWidth={2} />
            </>
          )}
        </button>
      </div>
    </motion.form>
  );
}

type RegisterReturn = ReturnType<ReturnType<typeof useForm<ContactInput>>["register"]>;

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
  children,
}: {
  id: string;
  label: string;
  error: string | null;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block font-heading font-medium uppercase mb-2"
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
      {children}
      {error && (
        <p
          role="alert"
          className="mt-1.5 font-body"
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
}: FieldBaseProps & { type?: string; autoComplete?: string }) {
  const [focused, setFocused] = useState(false);
  return (
    <FieldShell id={id} label={label} error={error}>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
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
              ? "rgb(var(--color-ink))"
              : "rgba(11,31,58,0.18)",
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? "not-allowed" : "text",
        }}
      />
    </FieldShell>
  );
}

function TextareaField({
  id,
  label,
  placeholder,
  register,
  error,
  disabled,
  maxLength,
}: FieldBaseProps & { maxLength?: number }) {
  const [focused, setFocused] = useState(false);
  return (
    <FieldShell id={id} label={label} error={error}>
      <textarea
        id={id}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        rows={5}
        aria-invalid={!!error}
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
              ? "rgb(var(--color-ink))"
              : "rgba(11,31,58,0.18)",
          lineHeight: 1.55,
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? "not-allowed" : "text",
        }}
      />
    </FieldShell>
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
                ? "rgb(var(--color-ink))"
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
          role="alert"
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
