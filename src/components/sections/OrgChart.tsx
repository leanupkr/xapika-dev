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

/** A leaf shared between multiple departments — drawn once, all parents
 *  connected with solid lines. */
type SharedLeaf = {
  key: string;
  label: string;
  parents: ReadonlyArray<string>;
};

type OrgChartProps = {
  ceoLabel: string;
  ceoName: string;
  departments: ReadonlyArray<Department>;
  sharedLeaves?: ReadonlyArray<SharedLeaf>;
  staff?: StaffDepartment;
};

type Rect = { x: number; y: number; w: number; h: number };
type RefCB = (el: HTMLDivElement | null) => void;

/* ──────────────────────────── Tokens ──────────────────────────── */

const LINE = "rgb(var(--color-ink) / 0.20)";
const LINE_SOFT = "rgb(var(--color-ink) / 0.10)";
const ACCENT = "rgb(var(--color-primary))";
const INK = "rgb(var(--color-ink))";
const INK_MUTED = "rgb(var(--color-ink) / 0.62)";
const SURFACE = "rgb(var(--color-surface))";

const CARD_GAP = 6;
const BAR_OFFSET = 18; // px above topmost child top — where the horizontal bar sits

/* ───────────────────────── Main component ───────────────────────── */

export default function OrgChart({
  ceoLabel,
  ceoName,
  departments,
  sharedLeaves,
  staff,
}: OrgChartProps) {
  /* Refs + measurement */
  const containerRef = useRef<HTMLDivElement | null>(null);
  const refsMap = useRef<Map<string, HTMLDivElement>>(new Map());
  const [rects, setRects] = useState<Record<string, Rect>>({});
  const [size, setSize] = useState({ w: 0, h: 0 });

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
  }, [departments, sharedLeaves, staff]);

  /* ───── Layout: split into first-dept (vertical) + rest-depts (horizontal row) ───── */
  const firstDept = departments[0];
  const restDepts = departments.slice(1);

  /* Build horizontal leaf slots in display order.
     A shared leaf is appended right after the dept that is its second-to-last
     parent (so the leaf sits between that dept's children and the next dept's). */
  type Slot = {
    col: number;
    type: "child" | "shared";
    label: string;
    refId: string;
    deptKey?: string; // for child slots
  };
  const { slots, deptColRange, totalLeafCols } = useMemo(() => {
    const slots: Slot[] = [];
    const deptColRange: Record<string, { start: number; end: number }> = {};
    let cursor = 2; // col 1 reserved for first dept's subtree

    restDepts.forEach((dept) => {
      let start = cursor;
      dept.children.forEach((label) => {
        slots.push({
          col: cursor,
          type: "child",
          label,
          refId: `leaf-${dept.key}-${label}`,
          deptKey: dept.key,
        });
        cursor++;
      });
      // Insert any shared leaf whose second-to-last parent is THIS dept,
      // so the shared leaf bridges this dept and the next.
      sharedLeaves?.forEach((sl) => {
        const idx = sl.parents.indexOf(dept.key);
        if (idx >= 0 && idx === sl.parents.length - 2) {
          slots.push({
            col: cursor,
            type: "shared",
            label: sl.label,
            refId: `shared-${sl.key}`,
          });
          cursor++;
        }
      });
      let end = cursor - 1;
      // Extend dept range to include shared leaves where this dept is the LAST parent
      sharedLeaves?.forEach((sl) => {
        if (
          sl.parents.length > 1 &&
          sl.parents[sl.parents.length - 1] === dept.key
        ) {
          const slot = slots.find((s) => s.refId === `shared-${sl.key}`);
          if (slot) start = Math.min(start, slot.col);
        }
      });
      deptColRange[dept.key] = { start, end };
    });

    return { slots, deptColRange, totalLeafCols: cursor - 2 };
  }, [restDepts, sharedLeaves]);

  /* For mobile, mark which shared leaves should render inline within each dept.
     Show shared leaf only under its FIRST parent's subtree (avoid DOM duplication). */
  const mobileSharedByDept = useMemo(() => {
    const m: Record<string, ReadonlyArray<SharedLeaf>> = {};
    sharedLeaves?.forEach((sl) => {
      if (sl.parents.length > 0) {
        const first = sl.parents[0];
        m[first] = [...(m[first] ?? []), sl];
      }
    });
    return m;
  }, [sharedLeaves]);

  /* ───── SVG paths ───── */
  const paths = useMemo(() => {
    type PathItem = { key: string; d: string };
    const out: PathItem[] = [];

    const ceo = rects["ceo"];
    if (!ceo) return out;

    const ceoBx = ceo.x + ceo.w / 2;
    const ceoBy = ceo.y + ceo.h + CARD_GAP;

    /* ───── Upper tree: CEO → all 3 depts (unified single path) ───── */
    const deptRects = departments
      .map((d) => ({ d, r: rects[`dept-${d.key}`] }))
      .filter((x): x is { d: Department; r: Rect } => !!x.r);

    if (deptRects.length > 0) {
      const upperBarY =
        Math.min(...deptRects.map(({ r }) => r.y)) - CARD_GAP - BAR_OFFSET;
      const deptCenters = deptRects.map(({ r }) => r.x + r.w / 2);
      const leftMostDept = Math.min(...deptCenters, ceoBx);
      const rightMostDept = Math.max(...deptCenters, ceoBx);
      const parts: string[] = [];
      // CEO vertical stem down to the bar
      parts.push(`M${ceoBx},${ceoBy} L${ceoBx},${upperBarY}`);
      // Single continuous horizontal bar across all depts (incl. CEO column)
      parts.push(`M${leftMostDept},${upperBarY} L${rightMostDept},${upperBarY}`);
      // Per-dept vertical stub down to dept top
      deptRects.forEach(({ r }) => {
        const cx = r.x + r.w / 2;
        parts.push(`M${cx},${upperBarY} L${cx},${r.y - CARD_GAP}`);
      });
      out.push({ key: "upper-tree", d: parts.join(" ") });
    }

    /* First dept (Int'l Ops) → vertical office tree on the left */
    if (firstDept) {
      const dr = rects[`dept-${firstDept.key}`];
      if (dr) {
        const dCx = dr.x + dr.w / 2;
        const dBy = dr.y + dr.h + CARD_GAP;
        const ofs = firstDept.children
          .map((c) => rects[`leaf-${firstDept.key}-${c}`])
          .filter(Boolean) as Rect[];
        if (ofs.length > 0) {
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
          out.push({ key: `tree-${firstDept.key}`, d: parts.join(" ") });
        }
      }
    }

    /* ───── Lower tree: rest depts → leaves (unified single path) ─────
       Single horizontal bar spans every leaf under every rest dept.
       Each rest dept has a vertical stem down to the bar; each leaf has
       a vertical stub down from the bar. Shared leaves are deduped. */
    type RestInfo = { dept: Department; dr: Rect; eff: Rect[] };
    const restInfo: RestInfo[] = [];
    restDepts.forEach((dept) => {
      const dr = rects[`dept-${dept.key}`];
      if (!dr) return;
      const ids = [
        ...dept.children.map((c) => `leaf-${dept.key}-${c}`),
        ...(sharedLeaves
          ?.filter((sl) => sl.parents.includes(dept.key))
          .map((sl) => `shared-${sl.key}`) ?? []),
      ];
      const eff = ids.map((id) => rects[id]).filter(Boolean) as Rect[];
      if (eff.length > 0) restInfo.push({ dept, dr, eff });
    });

    if (restInfo.length > 0) {
      // Dedupe leaf rects (shared leaves appear in multiple depts)
      const leafMap = new Map<string, Rect>();
      restInfo.forEach(({ eff }) =>
        eff.forEach((r) => leafMap.set(`${r.x.toFixed(2)},${r.y.toFixed(2)}`, r))
      );
      const allLeaves = Array.from(leafMap.values());
      const lowerBarY =
        Math.min(...allLeaves.map((r) => r.y)) - CARD_GAP - BAR_OFFSET;
      const leafCenters = allLeaves.map((r) => r.x + r.w / 2);
      const leftMost = Math.min(...leafCenters);
      const rightMost = Math.max(...leafCenters);

      const parts: string[] = [];
      // Single continuous horizontal bar
      parts.push(`M${leftMost},${lowerBarY} L${rightMost},${lowerBarY}`);
      // Each rest dept's vertical stem down to the bar
      restInfo.forEach(({ dr }) => {
        const cx = dr.x + dr.w / 2;
        const by = dr.y + dr.h + CARD_GAP;
        parts.push(`M${cx},${by} L${cx},${lowerBarY}`);
      });
      // Per-leaf vertical stub down from bar
      allLeaves.forEach((r) => {
        const cx = r.x + r.w / 2;
        parts.push(`M${cx},${lowerBarY} L${cx},${r.y - CARD_GAP}`);
      });
      out.push({ key: "lower-tree", d: parts.join(" ") });
    }

    return out;
  }, [rects, departments, sharedLeaves, firstDept, restDepts]);

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
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0"
        style={{
          height: "1px",
          backgroundColor: "rgb(var(--color-ink) / 0.06)",
        }}
      />
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
                stroke={LINE}
                strokeWidth={1}
                strokeLinecap="round"
              />
            ))}
          </svg>

          {/* Explicit grid: col 1 = first dept + subtree; middle cols = 1fr each;
              last col mirrors col 1 width so the central column (containing CEO
              + Maintenance) sits exactly at the container's geometric center. */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `1.5fr repeat(${Math.max(
                totalLeafCols - 1,
                0
              )}, 1fr) 1.5fr`,
              columnGap: "24px",
              rowGap: "5rem",
              alignItems: "start",
            }}
          >
            {/* Row 1: CEO — align center to col 3 (Maintenance center) by
                spanning the same range as Maintenance dept. */}
            <div
              style={{
                gridRow: 1,
                gridColumn: "2 / 5",
                justifySelf: "center",
              }}
            >
              <CeoCard
                label={ceoLabel}
                name={ceoName}
                refSetter={registerRef("ceo")}
              />
            </div>

            {/* Row 2: Dept cards */}
            {firstDept && (
              <div
                style={{
                  gridRow: 2,
                  gridColumn: 1,
                  justifySelf: "center",
                }}
              >
                <DeptCard
                  label={firstDept.label}
                  leadLabel={firstDept.leadLabel}
                  refSetter={registerRef(`dept-${firstDept.key}`)}
                />
              </div>
            )}
            {restDepts.map((dept) => {
              const range = deptColRange[dept.key];
              if (!range) return null;
              return (
                <div
                  key={dept.key}
                  style={{
                    gridRow: 2,
                    gridColumn: `${range.start} / ${range.end + 1}`,
                    justifySelf: "center",
                  }}
                >
                  <DeptCard
                    label={dept.label}
                    leadLabel={dept.leadLabel}
                    refSetter={registerRef(`dept-${dept.key}`)}
                  />
                </div>
              );
            })}

            {/* Row 3: leaves */}
            {firstDept && (
              <div
                style={{
                  gridRow: 3,
                  gridColumn: 1,
                  justifySelf: "stretch",
                }}
              >
                <OfficeColumn
                  depKey={firstDept.key}
                  offices={firstDept.children}
                  registerRef={registerRef}
                />
              </div>
            )}
            {slots.map((slot) => (
              <div
                key={slot.refId}
                style={{
                  gridRow: 3,
                  gridColumn: slot.col,
                  justifySelf: "center",
                }}
              >
                <LeafCard
                  label={slot.label}
                  refSetter={registerRef(slot.refId)}
                  shared={slot.type === "shared"}
                />
              </div>
            ))}
          </div>
        </div>

        {/* MOBILE */}
        <MobileTree
          ceoLabel={ceoLabel}
          ceoName={ceoName}
          departments={departments}
          mobileSharedByDept={mobileSharedByDept}
        />

        {/* Staff (Finance & HR) */}
        {staff && (
          <div style={{ marginTop: "clamp(4rem, 8vh, 6rem)" }}>
            <StaffCard staff={staff} />
          </div>
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

function OfficeColumn({
  depKey,
  offices,
  registerRef,
}: {
  depKey: string;
  offices: ReadonlyArray<string>;
  registerRef: (id: string) => RefCB;
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
      {offices.map((o) => (
        <li key={o}>
          <LeafCard
            label={o}
            refSetter={registerRef(`leaf-${depKey}-${o}`)}
          />
        </li>
      ))}
    </ul>
  );
}

function LeafCard({
  label,
  refSetter,
  shared,
}: {
  label: string;
  refSetter: RefCB;
  shared?: boolean;
}) {
  return (
    <div
      ref={refSetter}
      aria-label={
        shared
          ? `${label} — shared between Maintenance and Supply Chain`
          : undefined
      }
      style={{
        backgroundColor: SURFACE,
        border: `1px solid ${LINE_SOFT}`,
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
  mobileSharedByDept,
}: {
  ceoLabel: string;
  ceoName: string;
  departments: ReadonlyArray<Department>;
  mobileSharedByDept: Record<string, ReadonlyArray<SharedLeaf>>;
}) {
  const noopRef: RefCB = () => {};
  return (
    <div className="md:hidden flex flex-col items-center">
      <CeoCard label={ceoLabel} name={ceoName} refSetter={noopRef} />

      {departments.map((d) => {
        // Effective children for this dept on mobile: own children + shared
        // leaves where this dept is the FIRST parent (so each shared leaf
        // appears once, under the first parent's subtree).
        const sharedHere = mobileSharedByDept[d.key] ?? [];
        const effItems: { label: string; shared: boolean }[] = [
          ...d.children.map((c) => ({ label: c, shared: false })),
          ...sharedHere.map((sl) => ({ label: sl.label, shared: true })),
        ];
        return (
          <div key={d.key} className="w-full flex flex-col items-center">
            <MStem />
            <DeptCard
              label={d.label}
              leadLabel={d.leadLabel}
              refSetter={noopRef}
            />
            {effItems.length > 0 && (
              <>
                <MStem height={14} />
                <MTree items={effItems} />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

function MStem({
  height = 28,
}: {
  height?: number;
}) {
  return (
    <div
      aria-hidden
      style={{
        width: "1px",
        height: `${height}px`,
        borderLeft: `1px solid ${LINE}`,
      }}
    />
  );
}

function MTree({
  items,
}: {
  items: ReadonlyArray<{ label: string; shared: boolean }>;
}) {
  return (
    <ul
      role="list"
      className="mx-auto"
      style={{ width: "100%", maxWidth: "300px" }}
    >
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <li
            key={item.label}
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
              aria-label={
                item.shared
                  ? `${item.label} — shared between Maintenance and Supply Chain`
                  : undefined
              }
              style={{
                backgroundColor: SURFACE,
                border: `1px solid ${LINE_SOFT}`,
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
              {item.label}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
