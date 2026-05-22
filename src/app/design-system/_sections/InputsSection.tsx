import { SectionHeader } from "./ColorsSection";

const inputBase =
  "w-full rounded-lg border bg-white px-4 py-3 text-sm text-[rgb(var(--color-ink))] placeholder:text-[rgb(var(--color-ink-muted)/0.5)] transition-all duration-200 outline-none";

const states = {
  default: `${inputBase} border-[rgb(var(--color-ink)/0.2)]`,
  focus: `${inputBase} border-[rgb(var(--color-primary))] ring-2 ring-[rgb(var(--color-primary)/0.15)]`,
  error: `${inputBase} border-[rgb(var(--color-accent))] ring-2 ring-[rgb(var(--color-accent)/0.15)]`,
};

function InputStateGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-ink-muted)/0.6)]">
        {label}
      </p>
      {children}
    </div>
  );
}

function InputGroup({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl border border-[rgb(var(--color-ink)/0.07)] bg-[rgb(var(--color-bg))] p-5">
      <div className="mb-4">
        <p className="text-sm font-bold text-[rgb(var(--color-ink))]">{title}</p>
        <p className="text-xs text-[rgb(var(--color-ink-muted))]">{description}</p>
      </div>
      {title === "Text Input" && (
        <div className="grid gap-4 sm:grid-cols-3">
          <InputStateGroup label="Default">
            <input className={states.default} placeholder="Your Name" readOnly />
          </InputStateGroup>
          <InputStateGroup label="Focus (simulated)">
            <input className={states.focus} placeholder="Your Name" readOnly />
          </InputStateGroup>
          <InputStateGroup label="Error">
            <div>
              <input className={states.error} placeholder="Your Name" defaultValue="Invalid input" readOnly />
              <p className="mt-1 text-xs text-[rgb(var(--color-accent))]">This field is required</p>
            </div>
          </InputStateGroup>
        </div>
      )}
      {title === "Textarea" && (
        <div className="grid gap-4 sm:grid-cols-3">
          <InputStateGroup label="Default">
            <textarea className={`${states.default} resize-none`} rows={3} placeholder="Your Message" readOnly />
          </InputStateGroup>
          <InputStateGroup label="Focus (simulated)">
            <textarea className={`${states.focus} resize-none`} rows={3} placeholder="Your Message" readOnly />
          </InputStateGroup>
          <InputStateGroup label="Error">
            <div>
              <textarea
                className={`${states.error} resize-none`}
                rows={3}
                placeholder="Your Message"
                defaultValue="Too short"
                readOnly
              />
              <p className="mt-1 text-xs text-[rgb(var(--color-accent))]">Minimum 20 characters</p>
            </div>
          </InputStateGroup>
        </div>
      )}
      {title === "Select" && (
        <div className="grid gap-4 sm:grid-cols-3">
          <InputStateGroup label="Default">
            <div className="relative">
              <select
                className={`${states.default} cursor-pointer appearance-none pr-10`}
                defaultValue=""
              >
                <option value="" disabled>
                  Select country
                </option>
                <option>Poland</option>
                <option>Ukraine</option>
                <option>Korea</option>
                <option>Turkey</option>
              </select>
              <ChevronIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-ink-muted))]" />
            </div>
          </InputStateGroup>
          <InputStateGroup label="Focus (simulated)">
            <div className="relative">
              <select
                className={`${states.focus} cursor-pointer appearance-none pr-10`}
                defaultValue="Poland"
              >
                <option>Poland</option>
                <option>Ukraine</option>
                <option>Korea</option>
                <option>Turkey</option>
              </select>
              <ChevronIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-primary))]" />
            </div>
          </InputStateGroup>
          <InputStateGroup label="Error">
            <div>
              <div className="relative">
                <select className={`${states.error} cursor-pointer appearance-none pr-10`} defaultValue="">
                  <option value="" disabled>
                    Select country
                  </option>
                  <option>Poland</option>
                  <option>Ukraine</option>
                  <option>Korea</option>
                  <option>Turkey</option>
                </select>
                <ChevronIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-accent))]" />
              </div>
              <p className="mt-1 text-xs text-[rgb(var(--color-accent))]">Selection required</p>
            </div>
          </InputStateGroup>
        </div>
      )}
    </div>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      className={`pointer-events-none h-4 w-4 ${className}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function InputsSection() {
  return (
    <section>
      <SectionHeader label="04" title="Inputs" />
      <div className="mt-8 space-y-4">
        <InputGroup title="Text Input" description="border-ink/20, focus: border-primary ring-primary/15" />
        <InputGroup title="Textarea" description="Resizable disabled, same focus/error states" />
        <InputGroup title="Select" description="Appearance-none with custom chevron icon" />
      </div>
    </section>
  );
}
