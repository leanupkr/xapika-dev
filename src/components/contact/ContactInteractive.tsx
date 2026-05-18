"use client";

import { useState, useCallback } from "react";
import IntentChips, { type IntentKey } from "@/components/contact/IntentChips";
import ContactForm from "@/components/sections/ContactForm";

const INTENT_PRESETS: Record<IntentKey, string> = {
  businessInquiry: "Business inquiry — ",
  maintenanceRequest: "Maintenance request — ",
  pressMedia: "Press inquiry — ",
  careers: "Career inquiry — ",
};

type ContactInteractiveProps = {
  contactInfoSlot: React.ReactNode;
};

export default function ContactInteractive({
  contactInfoSlot,
}: ContactInteractiveProps) {
  const [selectedIntent, setSelectedIntent] = useState<IntentKey | null>(null);

  const handleSelect = useCallback((key: IntentKey | null) => {
    setSelectedIntent(key);
  }, []);

  const presetSubject = selectedIntent
    ? INTENT_PRESETS[selectedIntent]
    : undefined;

  return (
    <>
      <IntentChips selected={selectedIntent} onSelect={handleSelect} />
      <section
        data-bg="light"
        className="relative"
        style={{
          backgroundColor: "rgb(var(--color-bg))",
          paddingTop: "clamp(4rem, 8vh, 6rem)",
          paddingBottom: "clamp(5rem, 10vh, 7.5rem)",
        }}
      >
        <div
          className="relative mx-auto px-6 md:px-10 lg:px-16"
          style={{ maxWidth: "var(--max-width)" }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-5 lg:sticky lg:top-28">
              {contactInfoSlot}
            </div>
            <div className="lg:col-span-7">
              <ContactForm
                externalSubject={presetSubject}
                autoFocusKey={selectedIntent}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
