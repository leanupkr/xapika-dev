"use client";

import {
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/* ───────────────────────────── Types ───────────────────────────── */

type Department = {
  key: string;
  label: string;
  leadLabel?: string;
  children: ReadonlyArray<string>;
};

type StaffDepartment = {
  label: string;
  children: ReadonlyArray<string>;
};

type CrossFunctional = {
  key: string;
  /** The leaf label inside the primary parent's children that is cross-functional. */
  leafLabel: string;
  /** Department key where this leaf lives in the tree. */
  primaryParent: string;
  /** Additional department keys that share this team (rendered as dashed link). */
  alsoParents: ReadonlyArray<string>;
  caption?: string;
};

type OrgChartProps = {
  ceoLabel: string;
  ceoName: string;
  departments: ReadonlyArray<Department>;
  crossFunctional?: ReadonlyArray<CrossFunctional>;
  staff?: StaffDepartment;
};

type Rect = { x: number; y: number; w: number; h: number };
type RefCB = (el: HTMLDivElement | null) => void;

/* ──────────────────────────── Tokens ──────────────────────────── */

const LINE = "rgb(var(--color-ink) / 0.18)";
const LINE_SOFT = "rgb(var(--color-ink) / 0.10)";
const ACCENT = "rgb(var(--color-primary))";
const ACCENT_HAIR = "rgb(var(--color-primary) / 0.55)";
const INK = "rgb(var(--color-ink))";
const INK_MUTED = "rgb(var(--color-ink) / 0.62)";
const SURFACE = "rgb(var(--color-surface))";

const CARD_GAP = 6;
const CORNER_R = 10;

/* ───────────────────────── Main component ───────────────────────── */

export default function OrgChart({
  ceoLabel,
  ceoName,
  departments,
  crossFunctional,
  staff,
}: OrgChartProps) {
  /* ───── Refs + measurement ───── */
  const containerRef = useRef<HTMLDivElement | null>(null);
  const refsMap = useRef<Map<string, HTMLDivElement>>(new Map());
  const [rects, setRects] = useState<Record<string, Rect>>({});
  const [size, setSize] = useState({ w: 0, h: 0 });

  /* Stable ref callbacks keyed by id (cached so React doesn't re-attach on every render) */
  const registerRef = useMemo(() => {
    const cache: Record<string, RefCB> = {};
    return (id: string): RefCB => {
      if (!cache[id]) {
        cache[id] = (el) => {
          if (el) refsMap.current.set(id, el);
          else refsMap.current.delete(id);
        };
      }
      return cache[id];
    };
  }, []);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let rafId = 0;
    const compute = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const c = container.getBoundingClientRect();
        const next: Record<string, Rect> = {};
        refsMap.current.forEach((el, id) => {
          const r = el.getBoundingClientRect();
          next[id] = {
            x: r.left - c.left,
            y: r.top - c.top,
            w: r.width,
            h: r.height,
          };
        });
        setRects(next);
        setSize({ w: c.width, h: c.height });
      });
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(container);
    refsMap.current.forEach((el) => ro.observe(el));
    window.addEventListener("resize", compute);
    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      window.removeEventListener("resize", compute);
    };
  }, [departments, crossFunctional, staff]);

  /* ───── SVG path generation ───── */
  const paths = useMemo(() => {
    type PathItem = { key: string; d: string; dashed?: boolean };
    const out: PathItem[] = [];

    const elbow = (sx: number, sy: number, tx: number, ty: number) => {
      if (Math.abs(sx - tx) < 0.5) return `M${sx},${sy} L${tx},${ty}`;
      const midY = sy + (ty - sy) / 2;
      const dx = tx > sx ? 1 : -1;
      const r = Math.max(
        0,
        Math.min(CORNER_R, Math.abs(ty - sy) / 2 - 1, Math.abs(tx - sx) / 2 - 1)
      );
      return [
        `M${sx},${sy}`,
        `L${sx},${midY - r}`,
        `Q${sx},${midY} ${sx + dx * r},${midY}`,
        `L${tx - dx * r},${midY}`,
        `Q${tx},${midY} ${tx},${midY + r}`,
        `L${tx},${ty}`,
      ].join(" ");
    };

    const ceo = rects["ceo"];
    if (!ceo) return out;

    const ceoBx = ceo.x + ceo.w / 2;
    const ceoBy = ceo.y + ceo.h + CARD_GAP;

    /* CEO → Departments */
    departments.forEach((d) => {
      const dr = rects[`dept-${d.key}`];
      if (!dr) return;
      const tx = dr.x + dr.w / 2;
      const ty = dr.y - CARD_GAP;
      out.push({ key: `ceo-${d.key}`, d: elbow(ceoBx, ceoBy, tx, ty) });
    });

    /* Dept → Children */
    departments.forEach((d) => {
      const dr = rects[`dept-${d.key}`];
      if (!dr) return;
      const dCx = dr.x + dr.w / 2;
      const dBy = dr.y + dr.h + CARD_GAP;

      if (d.key === "international") {
        // Vertical office tree to the left of leaf cards
        const ofs = d.children
          .map((c) => rects[`leaf-${d.key}-${c}`])
          .filter(Boolean) as Rect[];
        if (ofs.length === 0) return;
        const anchorX = Math.min(...ofs.map((r) => r.x)) - 20;
        const elbowY = ofs[0].y - 16;
        const lastY = ofs[ofs.length - 1].y + ofs[ofs.length - 1].h / 2;
        const dx = anchorX > dCx ? 1 : -1;
        const r = 8;
        const parts: string[] = [];
        parts.push(`M${dCx},${dBy}`);
        parts.push(`L${dCx},${elbowY - r}`);
        parts.push(`Q${dCx},${elbowY} ${dCx + dx * r},${elbowY}`);
        parts.push(`L${anchorX - dx * r},${elbowY}`);
        parts.push(`Q${anchorX},${elbowY} ${anchorX},${elbowY + r}`);
        parts.push(`L${anchorX},${lastY}`);
        ofs.forEach((or) => {
          const my = or.y + or.h / 2;
          parts.push(`M${anchorX},${my}`);
          parts.push(`L${or.x - CARD_GAP},${my}`);
        });
        out.push({ key: `tree-${d.key}`, d: parts.join(" ") });
      } else {
        // Generic dept → each child with rounded elbow
        d.children.forEach((c) => {
          const cr = rects[`leaf-${d.key}-${c}`];
          if (!cr) return;
          const ct = cr.x + cr.w / 2;
          const cty = cr.y - CARD_GAP;
          out.push({ key: `${d.key}-${c}`, d: elbow(dCx, dBy, ct, cty) });
        });
      }
    });

    /* Cross-functional dashed bezier — from each additional parent dept
       directly to the leaf card (which lives inside the primary parent's subtree). */
    crossFunctional?.forEach((cf) => {
      const lr = rects[`leaf-${cf.primaryParent}-${cf.leafLabel}`];
      if (!lr) return;
      const lCx = lr.x + lr.w / 2;
      const lTopY = lr.y - CARD_GAP;
      cf.alsoParents.forEach((pk, i) => {
        const pr = rects[`dept-${pk}`];
        if (!pr) return;
        const pCx = pr.x + pr.w / 2;
        const fromLeft = pCx < lCx;
        const sx = fromLeft ? pr.x + pr.w - 16 : pr.x + 16;
        const sy = pr.y + pr.h + CARD_GAP;
        const tx = fromLeft ? lr.x + lr.w * 0.65 : lr.x + lr.w * 0.35;
        const ty = lTopY;
        const dx = tx - sx;
        const dy = ty - sy;
        const c1x = sx + dx * 0.10;
        const c1y = sy + dy * 0.55;
        const c2x = tx - dx * 0.10;
        const c2y = ty - dy * 0.55;
        out.push({
          key: `cf-${cf.key}-${pk}-${i}`,
          d: `M${sx},${sy} C${c1x},${c1y} ${c2x},${c2y} ${tx},${ty}`,
          dashed: true,
        });
      });
    });

    return out;
  }, [rects, departments, crossFunctional]);

  /* Map: "dept-key|leaf-label" → CrossFunctional metadata */
  const cfLeafMap = useMemo(() => {
    const m = new Map<string, CrossFunctional>();
    crossFunctional?.forEach((cf) =>
      m.set(`${cf.primaryParent}|${cf.leafLabel}`, cf)
    );
    return m;
  }, [crossFunctional]);

  /* ──────────────── Render ──────────────── */
  return (
    <section
      data-bg="light"
      className="relative bg-[rgb(var(--color-bg))]"
      style={{
        paddingTop: "clamp(4rem, 10vh, 7rem)",
        paddingBottom: "clamp(4rem, 10vh, 7rem)",
      }}
      aria-label="Organization chart"
    >
      {/* Top hairline */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0"
        style={{
          height: "1px",
          backgroundColor: "rgb(var(--color-ink) / 0.06)",
        }}
      />
      {/* Blueprint dot field — radial mask keeps it subtle */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgb(var(--color-ink) / 0.06) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        }}
      />

      <div
        className="relative mx-auto px-6 md:px-10 lg:px-16"
        style={{ maxWidth: "var(--max-width-content)" }}
      >
        <SectionCaption />

        {/* DESKTOP */}
        <div ref={containerRef} className="relative hidden md:block">
          <svg
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            width={size.w || 0}
            height={size.h || 0}
            style={{ overflow: "visible" }}
          >
            {paths.map((p) => (
              <path
                key={p.key}
                d={p.d}
                fill="none"
                stroke={p.dashed ? ACCENT_HAIR : LINE}
                strokeWidth={1}
                strokeLinecap="round"
                strokeDasharray={p.dashed ? "4 5" : undefined}
              />
            ))}
          </svg>

          {/* CEO */}
          <div className="flex justify-center">
            <CeoCard
              label={ceoLabel}
              name={ceoName}
              refSetter={registerRef("ceo")}
            />
          </div>

          {/* Dept row + sub-trees — Maintenance gets extra width to fit 3 children on one row */}
          <div
            className="grid mt-20"
            style={{
              gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.55fr) minmax(0, 1fr)",
              columnGap: "24px",
              alignItems: "start",
            }}
          >
            {departments.map((d) => (
              <div key={d.key} className="flex flex-col items-center">
                <DeptCard
                  label={d.label}
                  leadLabel={d.leadLabel}
                  refSetter={registerRef(`dept-${d.key}`)}
                />
                <div className="w-full" style={{ marginTop: "5.5rem" }}>
                  {d.key === "international" ? (
                    <OfficeColumn
                      depKey={d.key}
                      offices={d.children}
                      registerRef={registerRef}
                      cfMap={cfLeafMap}
                    />
                  ) : (
                    <ChildRow
                      depKey={d.key}
                      items={d.children}
                      registerRef={registerRef}
                      cfMap={cfLeafMap}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MOBILE */}
        <MobileTree
          ceoLabel={ceoLabel}
          ceoName={ceoName}
          departments={departments}
          cfMap={cfLeafMap}
        />

        {/* Staff (Finance & HR) — shared, separated from tree */}
        {staff && (
          <div style={{ marginTop: "clamp(4rem, 8vh, 6rem)" }}>
            <StaffCard staff={staff} />
          </div>
        )}

        {/* Cross-functional legend — footnote under the chart */}
        {crossFunctional && crossFunctional.length > 0 && (
          <CrossFunctionalLegend items={crossFunctional} />
        )}
      </div>
    </section>
  );
}

/* ─────────────────────────── Helpers ─────────────────────────── */

function SectionCaption() {
  return (
    <div className="mb-16 flex items-center justify-center gap-3">
      <span
        aria-hidden
        style={{
          display: "inline-block",
          width: "32px",
          height: "1px",
          backgroundColor: "rgb(var(--color-ink) / 0.25)",
        }}
      />
      <span
        className="font-heading font-medium uppercase"
        style={{
          fontSize: "10.5px",
          letterSpacing: "0.28em",
          color: "rgb(var(--color-ink) / 0.55)",
        }}
      >
        Operating Blueprint
      </span>
      <span
        aria-hidden
        style={{
          display: "inline-block",
          width: "32px",
          height: "1px",
          backgroundColor: "rgb(var(--color-ink) / 0.25)",
        }}
      />
    </div>
  );
}

function CeoCard({
  label,
  name,
  refSetter,
}: {
  label: string;
  name: string;
  refSetter: RefCB;
}) {
  return (
    <div
      ref={refSetter}
      style={{
        backgroundColor: "rgb(var(--color-primary) / 0.07)",
        border: "1.5px solid rgb(var(--color-primary) / 0.40)",
        borderRadius: "14px",
        padding: "22px 44px",
        textAlign: "center",
        minWidth: "260px",
      }}
    >
      <div
        className="font-heading font-medium uppercase"
        style={{
          fontSize: "10px",
          letterSpacing: "0.26em",
          color: ACCENT,
          marginBottom: "8px",
        }}
      >
        {label}
      </div>
      <div
        className="font-heading font-semibold"
        style={{
          fontSize: "1.125rem",
          color: INK,
          letterSpacing: "-0.01em",
          lineHeight: 1.2,
        }}
      >
        {name}
      </div>
    </div>
  );
}

function DeptCard({
  label,
  leadLabel,
  refSetter,
}: {
  label: string;
  leadLabel?: string;
  refSetter: RefCB;
}) {
  return (
    <div
      ref={refSetter}
      style={{
        backgroundColor: SURFACE,
        border: `1px solid ${LINE_SOFT}`,
        borderRadius: "12px",
        padding: "16px 22px",
        textAlign: "center",
        minWidth: "200px",
        maxWidth: "240px",
      }}
    >
      <div
        className="font-heading font-semibold"
        style={{
          fontSize: "0.95rem",
          color: INK,
          letterSpacing: "-0.01em",
          lineHeight: 1.3,
        }}
      >
        {label}
      </div>
      {leadLabel && (
        <span
          className="inline-block font-heading font-medium uppercase"
          style={{
            fontSize: "9.5px",
            letterSpacing: "0.22em",
            color: ACCENT,
            padding: "3px 10px",
            border: "1px solid rgb(var(--color-primary) / 0.40)",
            borderRadius: "999px",
            backgroundColor: "rgb(var(--color-primary) / 0.07)",
            marginTop: "10px",
          }}
        >
          {leadLabel}
        </span>
      )}
    </div>
  );
}

type CFMap = Map<string, CrossFunctional>;

function OfficeColumn({
  depKey,
  offices,
  registerRef,
  cfMap,
}: {
  depKey: string;
  offices: ReadonlyArray<string>;
  registerRef: (id: string) => RefCB;
  cfMap: CFMap;
}) {
  return (
    <ul
      role="list"
      className="flex flex-col mx-auto"
      style={{
        gap: "10px",
        width: "100%",
        maxWidth: "220px",
        paddingLeft: "44px",
      }}
    >
      {offices.map((o) => {
        const cf = cfMap.get(`${depKey}|${o}`);
        return (
          <li key={o}>
            <LeafCard
              label={o}
              refSetter={registerRef(`leaf-${depKey}-${o}`)}
              crossFunctional={!!cf}
              caption={cf?.caption}
            />
          </li>
        );
      })}
    </ul>
  );
}

function ChildRow({
  depKey,
  items,
  registerRef,
  cfMap,
}: {
  depKey: string;
  items: ReadonlyArray<string>;
  registerRef: (id: string) => RefCB;
  cfMap: CFMap;
}) {
  return (
    <div
      className="flex justify-center"
      style={{
        gap: items.length > 1 ? "12px" : 0,
        flexWrap: "wrap",
      }}
    >
      {items.map((c) => {
        const cf = cfMap.get(`${depKey}|${c}`);
        return (
          <LeafCard
            key={c}
            label={c}
            refSetter={registerRef(`leaf-${depKey}-${c}`)}
            crossFunctional={!!cf}
            caption={cf?.caption}
          />
        );
      })}
    </div>
  );
}

function LeafCard({
  label,
  refSetter,
  crossFunctional,
  caption,
}: {
  label: string;
  refSetter: RefCB;
  crossFunctional?: boolean;
  caption?: string;
}) {
  return (
    <div
      ref={refSetter}
      title={caption}
      aria-label={
        crossFunctional && caption ? `${label} — ${caption}` : undefined
      }
      style={{
        backgroundColor: crossFunctional
          ? "rgb(var(--color-primary) / 0.04)"
          : SURFACE,
        border: crossFunctional
          ? `1.25px dashed rgb(var(--color-primary) / 0.55)`
          : `1px solid ${LINE_SOFT}`,
        borderRadius: "10px",
        padding: "9px 14px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        fontSize: "12.5px",
        color: INK,
        letterSpacing: "-0.005em",
        whiteSpace: "nowrap",
      }}
    >
      <span
        aria-hidden
        style={{
          width: "5px",
          height: "5px",
          borderRadius: "999px",
          backgroundColor: ACCENT,
          flexShrink: 0,
        }}
      />
      {label}
    </div>
  );
}

function CrossFunctionalLegend({
  items,
}: {
  items: ReadonlyArray<CrossFunctional>;
}) {
  return (
    <div
      className="flex flex-col items-center"
      style={{ marginTop: "3rem", gap: "6px" }}
    >
      {items.map((cf) => (
        <div
          key={cf.key}
          className="flex items-center"
          style={{ gap: "10px" }}
        >
          <span
            aria-hidden
            style={{
              display: "inline-block",
              width: "26px",
              height: "0",
              borderTop: `1.25px dashed ${ACCENT_HAIR}`,
            }}
          />
          <span
            className="font-body"
            style={{
              fontSize: "11.5px",
              color: INK_MUTED,
              letterSpacing: "0.01em",
            }}
          >
            <strong style={{ color: INK, fontWeight: 600 }}>
              {cf.leafLabel}
            </strong>
            {cf.caption ? ` — ${cf.caption}` : null}
          </span>
        </div>
      ))}
    </div>
  );
}

function StaffCard({ staff }: { staff: StaffDepartment }) {
  return (
    <div className="w-full flex flex-col items-center">
      <div
        style={{
          backgroundColor: SURFACE,
          border: `1px solid ${LINE_SOFT}`,
          borderRadius: "12px",
          padding: "18px 30px",
          textAlign: "center",
          minWidth: "320px",
          maxWidth: "560px",
        }}
      >
        <div
          className="font-heading font-medium uppercase"
          style={{
            fontSize: "10px",
            letterSpacing: "0.22em",
            color: INK_MUTED,
          }}
        >
          Support
        </div>
        <div
          className="font-heading font-semibold"
          style={{
            fontSize: "0.95rem",
            color: INK,
            letterSpacing: "-0.01em",
            lineHeight: 1.3,
            marginTop: "6px",
          }}
        >
          {staff.label}
        </div>
        <div
          className="flex flex-wrap justify-center"
          style={{ gap: "6px 8px", marginTop: "12px" }}
        >
          {staff.children.map((child) => (
            <span
              key={child}
              style={{
                fontSize: "11.5px",
                color: INK_MUTED,
                lineHeight: 1.3,
                letterSpacing: "0.01em",
                padding: "4px 10px",
                border: `1px solid ${LINE_SOFT}`,
                borderRadius: "999px",
                backgroundColor: "rgb(var(--color-bg))",
              }}
            >
              {child}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────── Mobile ────────────────────────── */

function MobileTree({
  ceoLabel,
  ceoName,
  departments,
  cfMap,
}: {
  ceoLabel: string;
  ceoName: string;
  departments: ReadonlyArray<Department>;
  cfMap: CFMap;
}) {
  const noopRef: RefCB = () => {};
  return (
    <div className="md:hidden flex flex-col items-center">
      <CeoCard label={ceoLabel} name={ceoName} refSetter={noopRef} />

      {departments.map((d) => (
        <div key={d.key} className="w-full flex flex-col items-center">
          <MStem />
          <DeptCard
            label={d.label}
            leadLabel={d.leadLabel}
            refSetter={noopRef}
          />
          {d.children.length > 0 && (
            <>
              <MStem height={14} />
              <MTree depKey={d.key} items={d.children} cfMap={cfMap} />
            </>
          )}
        </div>
      ))}
    </div>
  );
}

function MStem({
  height = 28,
  dashed = false,
}: {
  height?: number;
  dashed?: boolean;
}) {
  return (
    <div
      aria-hidden
      style={{
        width: "1px",
        height: `${height}px`,
        borderLeft: `1px ${dashed ? "dashed" : "solid"} ${
          dashed ? ACCENT_HAIR : LINE
        }`,
      }}
    />
  );
}

function MTree({
  depKey,
  items,
  cfMap,
}: {
  depKey: string;
  items: ReadonlyArray<string>;
  cfMap: CFMap;
}) {
  return (
    <ul
      role="list"
      className="mx-auto"
      style={{ width: "100%", maxWidth: "300px" }}
    >
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        const cf = cfMap.get(`${depKey}|${item}`);
        return (
          <li
            key={item}
            className="relative"
            style={{
              paddingLeft: "28px",
              paddingTop: "5px",
              paddingBottom: "5px",
            }}
          >
            <span
              aria-hidden
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: "1px",
                height: isLast ? "50%" : "100%",
                backgroundColor: LINE,
              }}
            />
            <span
              aria-hidden
              style={{
                position: "absolute",
                left: 0,
                top: "50%",
                width: "22px",
                height: "1px",
                backgroundColor: LINE,
              }}
            />
            <div
              title={cf?.caption}
              aria-label={
                cf && cf.caption ? `${item} — ${cf.caption}` : undefined
              }
              style={{
                backgroundColor: cf
                  ? "rgb(var(--color-primary) / 0.04)"
                  : SURFACE,
                border: cf
                  ? `1.25px dashed rgb(var(--color-primary) / 0.55)`
                  : `1px solid ${LINE_SOFT}`,
                borderRadius: "10px",
                padding: "9px 14px",
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "12.5px",
                color: INK,
              }}
            >
              <span
                aria-hidden
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "999px",
                  backgroundColor: ACCENT,
                  flexShrink: 0,
                }}
              />
              {item}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
