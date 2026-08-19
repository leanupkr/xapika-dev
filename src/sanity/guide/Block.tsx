// src/sanity/guide/Block.tsx
//
// Renders one GuideBlock — the tagged union defined in content.tsx
// (`text` | `steps` | `shot` | `mapping` | `callout`) — as Studio-safe
// markup: plain elements plus the classes from theme.ts, no @sanity/ui, no
// Tailwind (see GuideTool.tsx's header comment for why neither works
// inside Studio's bundle).
//
// This file owns *how* each `kind` renders; content.tsx owns *what* the
// data says — it stays plain data (no JSX), so the person maintaining the
// guide's text never has to touch rendering code. The `never` branch below
// is a real exhaustiveness check: if content.tsx's GuideBlock union ever
// grows a new `kind`, `tsc --noEmit` fails here until this switch handles
// it too.

import type { GuideBlock } from "./content";
import { Shot } from "./Shot";

export function GuideBlockView({ block }: { block: GuideBlock }) {
  switch (block.kind) {
    case "text":
      return <p className="xk-guide-p">{block.body}</p>;

    case "steps":
      return (
        <ol className="xk-guide-steps">
          {block.items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ol>
      );

    case "shot":
      return <Shot name={block.shot.name} caption={block.shot.caption} />;

    case "mapping":
      return (
        <div className="xk-guide-table-wrap">
          <table className="xk-guide-table">
            <thead>
              <tr>
                <th>필드</th>
                <th>화면 라벨</th>
                <th>어디에 나타나나</th>
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, index) => (
                <tr key={index}>
                  <td>
                    <code className="xk-guide-code">{row.field}</code>
                  </td>
                  <td>{row.label}</td>
                  <td>{row.showsUp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "callout": {
      const icon = block.tone === "danger" ? "🚫" : block.tone === "warning" ? "⚠️" : "ℹ️";
      return (
        <div className={`xk-guide-callout xk-guide-callout--${block.tone}`}>
          <span aria-hidden="true" className="xk-guide-callout-icon">
            {icon}
          </span>
          <div>{block.body}</div>
        </div>
      );
    }

    default: {
      const exhaustiveCheck: never = block;
      return exhaustiveCheck;
    }
  }
}
