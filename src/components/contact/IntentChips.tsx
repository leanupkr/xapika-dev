"use client";

import { useCallback } from "react";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";

export type IntentKey =
  | "businessInquiry"
  | "maintenanceRequest"
  | "pressMedia"
  | "careers";

const INTENT_KEYS: IntentKey[] = [
  "businessInquiry",
  "maintenanceRequest",
  "pressMedia",
  "careers",
];

type IntentChipsProps = {
  selected: IntentKey | null;
  onSelect: (key: IntentKey | null) => void;
};

export default function IntentChips({ selected, onSelect }: IntentChipsProps) {
  const t = useTranslations("contactPage.intentChips");

  const handleSelect = useCallback(
    (key: IntentKey) => {
      onSelect(selected === key ? null : key);
    },
    [selected, onSelect]
  );

  return (
    <section
      style={{
        backgroundColor: "rgb(var(--color-bg))",
        paddingTop: "clamp(2rem, 4vh, 3rem)",
        paddingBottom: "clamp(2rem, 4vh, 3rem)",
        borderBottom: "1px solid rgba(11,31,58,0.08)",
      }}
    >
      <div
        className="mx-auto px-6 md:px-10 lg:px-16"
        style={{ maxWidth: "var(--max-width)" }}
      >
        <p
          id="intent-chips-label"
          className="font-heading font-medium uppercase mb-4"
          style={{
            fontSize: "11px",
            letterSpacing: "0.18em",
            color: "rgba(11,31,58,0.48)",
          }}
        >
          {t("groupLabel")}
        </p>
        <div
          role="group"
          aria-labelledby="intent-chips-label"
          className="grid grid-cols-2 lg:grid-cols-4 gap-3"
        >
          {INTENT_KEYS.map((key) => {
            const isSelected = selected === key;
            return (
              <IntentChip
                key={key}
                label={t(key)}
                isSelected={isSelected}
                onClick={() => handleSelect(key)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

type IntentChipProps = {
  label: string;
  isSelected: boolean;
  onClick: () => void;
};

function IntentChip({ label, isSelected, onClick }: IntentChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isSelected}
      className="inline-flex items-center justify-center gap-2 transition-all duration-200 select-none"
      style={{
        height: "44px",
        padding: "0 18px",
        borderRadius: "999px",
        border: isSelected
          ? "1px solid rgb(var(--color-primary))"
          : "1px solid rgba(11,31,58,0.14)",
        backgroundColor: isSelected
          ? "rgba(246,163,23,0.10)"
          : "transparent",
        fontFamily: "var(--font-heading)",
        fontSize: "13px",
        letterSpacing: "0.04em",
        fontWeight: 500,
        color: "rgb(var(--color-ink))",
        cursor: "pointer",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          (e.currentTarget as HTMLButtonElement).style.borderColor =
            "rgba(246,163,23,0.60)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          (e.currentTarget as HTMLButtonElement).style.borderColor =
            "rgba(11,31,58,0.14)";
        }
      }}
    >
      {isSelected && (
        <Check
          size={12}
          strokeWidth={2.5}
          aria-hidden="true"
          style={{ flexShrink: 0, color: "rgb(var(--color-primary))" }}
        />
      )}
      {label}
    </button>
  );
}
